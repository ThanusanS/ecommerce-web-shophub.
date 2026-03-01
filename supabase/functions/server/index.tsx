import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const getSupabaseAdmin = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    console.log('Authorization error: No token provided');
    return c.json({ error: 'Authorization token required' }, 401);
  }

  console.log(`📝 Verifying token: ${accessToken.substring(0, 30)}...`)

  // Check if it's a session token (our new system)
  if (accessToken.startsWith('session_')) {
    try {
      const sessionData = await kv.get(`session:${accessToken}`);
      
      if (!sessionData) {
        console.log('❌ Session not found');
        return c.json({ 
          error: 'Invalid or expired session', 
          code: 401,
          message: 'Session not found. Please login again.'
        }, 401);
      }
      
      const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
      
      // Check if session expired
      if (session.expiresAt < Date.now()) {
        console.log('❌ Session expired');
        await kv.del(`session:${accessToken}`);
        return c.json({ 
          error: 'Session expired', 
          code: 401,
          message: 'Your session has expired. Please login again.'
        }, 401);
      }
      
      console.log(`✅ Valid session for user: ${session.email}`);
      c.set('userId', session.userId);
      c.set('userEmail', session.email);
      await next();
      return;
    } catch (error) {
      console.error('Session validation error:', error);
      return c.json({ 
        error: 'Session validation failed', 
        code: 401,
        message: 'Could not validate session'
      }, 401);
    }
  }

  // Fallback to JWT validation for backward compatibility
  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.log('❌ Authorization error while verifying user token:', error?.message || 'No user found');
    console.log('Error details:', JSON.stringify(error, null, 2));
    return c.json({ 
      error: 'Invalid or expired token', 
      code: 401,
      message: error?.message || 'Token validation failed',
      details: error?.name || 'Unknown error'
    }, 401);
  }

  console.log(`✅ Token valid for user: ${user.email} (${user.id})`);
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
};

// Middleware to verify admin access
const requireAdmin = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    console.log('❌ Authorization error: No token provided');
    return c.json({ error: 'Authorization token required' }, 401);
  }

  console.log(`📝 Verifying admin session: ${accessToken.substring(0, 30)}...`);

  // Check if it's a session token (our new system)
  if (accessToken.startsWith('session_')) {
    try {
      const sessionData = await kv.get(`session:${accessToken}`);
      
      if (!sessionData) {
        console.log('❌ Session not found');
        return c.json({ 
          error: 'Invalid or expired session', 
          code: 401,
          message: 'Session not found. Please login again.'
        }, 401);
      }
      
      const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
      
      // Check if session expired
      if (session.expiresAt < Date.now()) {
        console.log('❌ Session expired');
        await kv.del(`session:${accessToken}`);
        return c.json({ 
          error: 'Session expired', 
          code: 401,
          message: 'Your session has expired. Please login again.'
        }, 401);
      }
      
      console.log(`✅ Valid session for user: ${session.email} (role: ${session.role})`);
      
      // Check if user is admin
      if (session.role !== 'admin' && session.email !== 'admin@shop.com') {
        console.log(`❌ Access denied for ${session.email} - not an admin`);
        return c.json({ error: 'Admin access required' }, 403);
      }
      
      console.log(`✅ Admin access granted for ${session.email}`);
      c.set('userId', session.userId);
      c.set('userEmail', session.email);
      await next();
      return;
    } catch (error) {
      console.error('Session validation error:', error);
      return c.json({ 
        error: 'Session validation failed', 
        code: 401,
        message: 'Could not validate session'
      }, 401);
    }
  }
  
  // Fallback to JWT validation for backward compatibility
  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.log('❌ JWT validation failed:', error?.message || 'No user found');
    return c.json({ 
      error: 'Invalid or expired token', 
      code: 401,
      message: error?.message || 'Invalid JWT',
      details: 'Please logout and login again to refresh your session'
    }, 401);
  }

  const userId = user.id;
  const userEmail = user.email;

  console.log(`✅ JWT valid for user: ${userEmail} (${userId})`);

  // Check if user is admin
  const userRole = await kv.get(`user_role:${userId}`);
  console.log(`🔑 User role for ${userEmail}:`, userRole);

  if (userEmail !== 'admin@shop.com' && userRole !== 'admin') {
    console.log(`❌ Access denied for ${userEmail} - not an admin`);
    return c.json({ error: 'Admin access required' }, 403);
  }

  console.log(`✅ Admin access granted for ${userEmail}`);
  c.set('userId', userId);
  c.set('userEmail', userEmail);
  await next();
};

// Health check endpoint
app.get("/make-server-bb77abb6/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize admin user endpoint
app.post("/make-server-bb77abb6/init-admin", async (c) => {
  try {
    const supabase = getSupabaseAdmin();
    
    // Check if admin user exists
    const { data: users } = await supabase.auth.admin.listUsers();
    const adminUser = users.users.find(u => u.email === 'admin@shop.com');
    
    if (adminUser) {
      console.log('Admin user already exists:', adminUser.id);
      
      // Ensure role is set
      await kv.set(`user_role:${adminUser.id}`, 'admin');
      await kv.set(`user_metadata:${adminUser.id}`, {
        name: 'Admin',
        email: 'admin@shop.com',
        createdAt: adminUser.created_at,
      });
      
      return c.json({ 
        success: true, 
        message: 'Admin user already exists',
        userId: adminUser.id 
      });
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@shop.com',
      password: 'admin123',
      user_metadata: { name: 'Admin' },
      email_confirm: true,
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('Admin user created:', data.user.id);
    
    // Set admin role
    await kv.set(`user_role:${data.user.id}`, 'admin');
    await kv.set(`user_metadata:${data.user.id}`, {
      name: 'Admin',
      email: 'admin@shop.com',
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ 
      success: true, 
      message: 'Admin user created successfully',
      userId: data.user.id 
    });
  } catch (error) {
    console.error('Init admin error:', error);
    return c.json({ error: 'Failed to initialize admin user' }, 500);
  }
});

// Debug token endpoint
app.get("/make-server-bb77abb6/debug/token", async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'No token provided', hasToken: false });
  }
  
  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  return c.json({
    hasToken: true,
    tokenLength: accessToken.length,
    tokenStart: accessToken.substring(0, 20),
    isValid: !!user,
    error: error?.message || null,
    userId: user?.id || null,
    userEmail: user?.email || null,
  });
});

// ========== AUTH ROUTES ==========

// Sign up
app.post("/make-server-bb77abb6/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error while creating new user:', error);
      return c.json({ error: error.message }, 400);
    }

    // Set user role - automatically make admin@shop.com an admin
    const userRole = email === 'admin@shop.com' ? 'admin' : 'user';
    await kv.set(`user_role:${data.user.id}`, userRole);
    
    // Store user metadata
    await kv.set(`user_metadata:${data.user.id}`, {
      name: name || '',
      email,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        name: name || '',
      } 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Login endpoint
app.post("/make-server-bb77abb6/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log(`🔐 Login attempt for: ${email}`);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.log('❌ Login failed:', error?.message);
      return c.json({ error: error?.message || 'Login failed' }, 400);
    }

    const userId = data.user.id;
    const userEmail = data.user.email;
    
    console.log(`✅ Login successful for ${userEmail} (${userId})`);
    
    // Get user role or set admin role if it's the admin email
    let userRole = await kv.get(`user_role:${userId}`);
    
    // Ensure admin@shop.com always has admin role
    if (userEmail === 'admin@shop.com') {
      userRole = 'admin';
      await kv.set(`user_role:${userId}`, 'admin');
      console.log(`🔑 Set admin role for ${userEmail}`);
    }
    
    console.log(`User role: ${userRole}`);
    
    // Create a simple session token (avoid JWT issues)
    const sessionToken = `session_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Store session in KV with user info (expire in 24 hours)
    await kv.set(`session:${sessionToken}`, JSON.stringify({
      userId,
      email: userEmail,
      role: userRole || 'user',
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    }));
    
    console.log(`✅ Session created: ${sessionToken.substring(0, 30)}...`);

    return c.json({
      accessToken: sessionToken, // Return session token instead of JWT
      user: {
        id: userId,
        email: userEmail,
        name: data.user.user_metadata?.name || userEmail,
        role: userRole || 'user',
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Auth refresh endpoint
app.post("/make-server-bb77abb6/auth/refresh", async (c) => {
  const { accessToken } = await c.req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  );

  // Try to get the current user with the old token
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  // Get a fresh session
  const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession({
    refresh_token: accessToken,
  });

  if (sessionError || !sessionData.session) {
    return c.json({ error: 'Failed to refresh session' }, 401);
  }

  // Get user role from KV store
  const userRole = await kv.get(`user_role:${user.id}`) || 'user';
  
  // Get user metadata from KV store
  const userMetadata = await kv.get(`user_metadata:${user.id}`);
  const name = userMetadata?.name || user.user_metadata?.name || user.email!.split('@')[0];

  return c.json({
    accessToken: sessionData.session.access_token,
    user: {
      id: user.id,
      email: user.email!,
      name: name,
      role: userRole,
    },
  });
});

// Get current user profile
app.get("/make-server-bb77abb6/auth/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userRole = await kv.get(`user_role:${userId}`) || 'user';
    const userMetadata = await kv.get(`user_metadata:${userId}`) || {};

    return c.json({
      id: userId,
      email: c.get('userEmail'),
      role: userRole,
      name: userMetadata.name || '',
      createdAt: userMetadata.createdAt,
    });
  } catch (error) {
    console.log('Profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-bb77abb6/auth/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { name } = await c.req.json();

    const currentMetadata = await kv.get(`user_metadata:${userId}`) || {};
    await kv.set(`user_metadata:${userId}`, {
      ...currentMetadata,
      name: name || currentMetadata.name,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, name });
  } catch (error) {
    console.log('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ========== ADMIN ROUTES - PRODUCTS ==========

// Get all products
app.get("/make-server-bb77abb6/admin/products", requireAuth, requireAdmin, async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Create product
app.post("/make-server-bb77abb6/admin/products", requireAuth, requireAdmin, async (c) => {
  try {
    const productData = await c.req.json();
    const productId = `product:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const product = {
      ...productData,
      id: productId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(productId, product);
    return c.json({ success: true, product });
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product
app.put("/make-server-bb77abb6/admin/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const productId = c.req.param('id');
    const updates = await c.req.json();

    const existing = await kv.get(productId);
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const product = {
      ...existing,
      ...updates,
      id: productId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(productId, product);
    return c.json({ success: true, product });
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product
app.delete("/make-server-bb77abb6/admin/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const productId = c.req.param('id');
    await kv.del(productId);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ========== ADMIN ROUTES - ORDERS ==========

// Get all orders
app.get("/make-server-bb77abb6/admin/orders", requireAuth, requireAdmin, async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    return c.json({ orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status
app.put("/make-server-bb77abb6/admin/orders/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status } = await c.req.json();

    const existing = await kv.get(orderId);
    if (!existing) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const order = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(orderId, order);
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error updating order:', error);
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// ========== ADMIN ROUTES - USERS ==========

// Get all users
app.get("/make-server-bb77abb6/admin/users", requireAuth, requireAdmin, async (c) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.log('Error fetching users from Supabase:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // Enrich with role and metadata
    const users = await Promise.all(data.users.map(async (user) => {
      const role = await kv.get(`user_role:${user.id}`) || 'user';
      const metadata = await kv.get(`user_metadata:${user.id}`) || {};
      return {
        id: user.id,
        email: user.email,
        role,
        name: metadata.name || user.user_metadata?.name || '',
        createdAt: user.created_at,
      };
    }));

    return c.json({ users });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Update user role
app.put("/make-server-bb77abb6/admin/users/:id/role", requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const { role } = await c.req.json();

    if (!['admin', 'user'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    await kv.set(`user_role:${userId}`, role);
    return c.json({ success: true, role });
  } catch (error) {
    console.log('Error updating user role:', error);
    return c.json({ error: 'Failed to update user role' }, 500);
  }
});

// Delete user
app.delete("/make-server-bb77abb6/admin/users/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.log('Error deleting user from Supabase:', error);
      return c.json({ error: 'Failed to delete user' }, 500);
    }

    // Clean up KV data
    await kv.del(`user_role:${userId}`);
    await kv.del(`user_metadata:${userId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// ========== ADMIN ROUTES - ANALYTICS ==========

// Get dashboard analytics
app.get("/make-server-bb77abb6/admin/analytics", requireAuth, requireAdmin, async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    const products = await kv.getByPrefix('product:');
    
    const supabase = getSupabaseAdmin();
    const { data: usersData } = await supabase.auth.admin.listUsers();

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = usersData?.users.length || 0;

    // Order status breakdown
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return c.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// ========== USER ROUTES - ORDERS ==========

// Create order
app.post("/make-server-bb77abb6/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderData = await c.req.json();
    
    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      ...orderData,
      id: orderId,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(orderId, order);
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get user's orders
app.get("/make-server-bb77abb6/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allOrders = await kv.getByPrefix('order:');
    const userOrders = allOrders.filter(order => order.userId === userId);
    
    return c.json({ orders: userOrders });
  } catch (error) {
    console.log('Error fetching user orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// ========== PUBLIC ROUTES - PRODUCTS ==========

// Get all products (public, no auth required)
app.get("/make-server-bb77abb6/products", async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product by ID (public, no auth required)
app.get("/make-server-bb77abb6/products/:id", async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(productId);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

Deno.serve(app.fetch);