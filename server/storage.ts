import { randomUUID } from "crypto";
import { eq, desc, inArray, and, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { 
  users, addresses, categories, products, orders, orderItems, 
  banners, motoboys, stockLogs, settings, deliveryZones, neighborhoods, trendingProducts, passwordResetRequests,
  shoppingLists, shoppingListItems
} from "@shared/schema";
import bcrypt from "bcrypt";
import type { 
  User, InsertUser, 
  Address, InsertAddress,
  Category, InsertCategory,
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Banner, InsertBanner,
  Motoboy, InsertMotoboy,
  StockLog, InsertStockLog,
  Settings, InsertSettings,
  DeliveryZone, InsertDeliveryZone,
  Neighborhood, InsertNeighborhood,
  TrendingProduct, InsertTrendingProduct,
  PasswordResetRequest, InsertPasswordResetRequest,
  ShoppingList, InsertShoppingList,
  ShoppingListItem, InsertShoppingListItem
} from "@shared/schema";

export interface IStorage {
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByWhatsapp(whatsapp: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getAddresses(userId: string): Promise<Address[]>;
  getAddress(id: string): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: string): Promise<boolean>;

  getCategories(): Promise<Category[]>;
  getCategoriesBySales(): Promise<(Category & { salesCount: number })[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  getProducts(): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getTrendingProducts(limit?: number): Promise<{ product: Product; salesCount: number }[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  getOrderItems(orderId: string): Promise<OrderItem[]>;
  getAllOrderItems(): Promise<OrderItem[]>;
  getOrderItemsByOrderIds(orderIds: string[]): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  getBanners(): Promise<Banner[]>;
  getBanner(id: string): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: string): Promise<boolean>;

  getMotoboys(): Promise<Motoboy[]>;
  getMotoboy(id: string): Promise<Motoboy | undefined>;
  getMotoboyByWhatsapp(whatsapp: string): Promise<Motoboy | undefined>;
  getOrdersByMotoboy(motoboyId: string, startDate?: Date, endDate?: Date): Promise<Order[]>;
  createMotoboy(motoboy: InsertMotoboy): Promise<Motoboy>;
  updateMotoboy(id: string, motoboy: Partial<InsertMotoboy>): Promise<Motoboy | undefined>;
  deleteMotoboy(id: string): Promise<boolean>;

  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  createStockLog(log: InsertStockLog): Promise<StockLog>;

  getDeliveryZones(): Promise<DeliveryZone[]>;
  getDeliveryZone(id: string): Promise<DeliveryZone | undefined>;
  createDeliveryZone(zone: InsertDeliveryZone): Promise<DeliveryZone>;
  updateDeliveryZone(id: string, zone: Partial<InsertDeliveryZone>): Promise<DeliveryZone | undefined>;
  deleteDeliveryZone(id: string): Promise<boolean>;

  getNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhoodsByZone(zoneId: string): Promise<Neighborhood[]>;
  getNeighborhood(id: string): Promise<Neighborhood | undefined>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  updateNeighborhood(id: string, neighborhood: Partial<InsertNeighborhood>): Promise<Neighborhood | undefined>;
  deleteNeighborhood(id: string): Promise<boolean>;

  getCuratedTrendingProducts(): Promise<(TrendingProduct & { product: Product })[]>;
  addTrendingProduct(productId: string): Promise<TrendingProduct>;
  removeTrendingProduct(id: string): Promise<boolean>;
  updateTrendingProductOrder(id: string, sortOrder: number): Promise<TrendingProduct | undefined>;
  reorderTrendingProducts(orderedIds: string[]): Promise<void>;

  getPasswordResetRequests(): Promise<PasswordResetRequest[]>;
  getPendingPasswordResetRequests(): Promise<PasswordResetRequest[]>;
  createPasswordResetRequest(request: InsertPasswordResetRequest): Promise<PasswordResetRequest>;
  completePasswordResetRequest(id: string, completedBy: string): Promise<PasswordResetRequest | undefined>;

  getShoppingLists(): Promise<ShoppingList[]>;
  getActiveShoppingList(): Promise<ShoppingList | undefined>;
  getShoppingList(id: string): Promise<ShoppingList | undefined>;
  createShoppingList(list: InsertShoppingList): Promise<ShoppingList>;
  updateShoppingList(id: string, list: Partial<ShoppingList>): Promise<ShoppingList | undefined>;
  completeShoppingList(id: string): Promise<ShoppingList | undefined>;
  deleteShoppingList(id: string): Promise<boolean>;
  
  getShoppingListItems(listId: string): Promise<ShoppingListItem[]>;
  createShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingListItem(id: string, item: Partial<ShoppingListItem>): Promise<ShoppingListItem | undefined>;
  markItemPurchased(id: string, purchased: boolean, actualQuantity?: number): Promise<ShoppingListItem | undefined>;
  deleteShoppingListItem(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWhatsapp(whatsapp: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.whatsapp, whatsapp));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db.insert(users).values({ 
      id, 
      name: insertUser.name,
      whatsapp: insertUser.whatsapp,
      role: insertUser.role ?? "customer",
      password: insertUser.password ?? null,
      isBlocked: insertUser.isBlocked ?? false,
    }).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, id));
    for (const order of userOrders) {
      await db.delete(orderItems).where(eq(orderItems.orderId, order.id));
    }
    await db.delete(orders).where(eq(orders.userId, id));
    await db.delete(addresses).where(eq(addresses.userId, id));
    await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async getAddress(id: string): Promise<Address | undefined> {
    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    return address || undefined;
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = randomUUID();
    const [address] = await db.insert(addresses).values({ 
      id, 
      userId: insertAddress.userId,
      street: insertAddress.street,
      number: insertAddress.number,
      complement: insertAddress.complement ?? null,
      neighborhood: insertAddress.neighborhood,
      city: insertAddress.city,
      state: insertAddress.state,
      zipCode: insertAddress.zipCode,
      notes: insertAddress.notes ?? null,
      isDefault: insertAddress.isDefault ?? true 
    }).returning();
    return address;
  }

  async updateAddress(id: string, updates: Partial<InsertAddress>): Promise<Address | undefined> {
    const [address] = await db.update(addresses).set(updates).where(eq(addresses.id, id)).returning();
    return address || undefined;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const result = await db.delete(addresses).where(eq(addresses.id, id));
    return true;
  }

  async getCategories(): Promise<Category[]> {
    const result = await db.select().from(categories).where(eq(categories.isActive, true));
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getCategoriesBySales(): Promise<(Category & { salesCount: number })[]> {
    const allCategories = await db.select().from(categories).where(eq(categories.isActive, true));
    const deliveredOrders = await db.select().from(orders).where(eq(orders.status, 'delivered'));
    const deliveredOrderIds = deliveredOrders.map(o => o.id);
    
    if (deliveredOrderIds.length === 0) {
      return allCategories.map(c => ({ ...c, salesCount: 0 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    
    const allOrderItems = await db.select().from(orderItems)
      .where(inArray(orderItems.orderId, deliveredOrderIds));
    
    const productIds = Array.from(new Set(allOrderItems.map(item => item.productId)));
    if (productIds.length === 0) {
      return allCategories.map(c => ({ ...c, salesCount: 0 })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    
    const allProducts = await db.select().from(products)
      .where(inArray(products.id, productIds));
    
    const productCategoryMap = new Map(allProducts.map(p => [p.id, p.categoryId]));
    
    const categorySalesMap = new Map<string, number>();
    for (const item of allOrderItems) {
      const categoryId = productCategoryMap.get(item.productId);
      if (categoryId) {
        const currentCount = categorySalesMap.get(categoryId) || 0;
        categorySalesMap.set(categoryId, currentCount + item.quantity);
      }
    }
    
    return allCategories
      .map(c => ({ ...c, salesCount: categorySalesMap.get(c.id) || 0 }))
      .sort((a, b) => b.salesCount - a.salesCount);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const [category] = await db.insert(categories).values({ 
      id, 
      name: insertCategory.name,
      iconUrl: insertCategory.iconUrl ?? null,
      sortOrder: insertCategory.sortOrder ?? 0,
      isActive: insertCategory.isActive ?? true,
    }).returning();
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return category || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  async getProducts(): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.isActive, true));
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getAllProducts(): Promise<Product[]> {
    const result = await db.select().from(products);
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const result = await db.select().from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)));
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const [product] = await db.insert(products).values({ 
      id, 
      categoryId: insertProduct.categoryId,
      name: insertProduct.name,
      description: insertProduct.description ?? null,
      imageUrl: insertProduct.imageUrl ?? null,
      costPrice: insertProduct.costPrice,
      profitMargin: insertProduct.profitMargin,
      salePrice: insertProduct.salePrice,
      stock: insertProduct.stock ?? 0,
      isActive: insertProduct.isActive ?? true,
      isPrepared: insertProduct.isPrepared ?? false,
      productType: insertProduct.productType ?? null,
      sortOrder: insertProduct.sortOrder ?? 0,
      comboEligible: insertProduct.comboEligible ?? false,
    }).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const allowedFields = ['categoryId', 'name', 'description', 'imageUrl', 'costPrice', 'profitMargin', 'salePrice', 'stock', 'isActive', 'isPrepared', 'productType', 'sortOrder', 'comboEligible'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key, value]) => value !== undefined && allowedFields.includes(key))
    );
    if (Object.keys(filteredUpdates).length === 0) {
      return this.getProduct(id);
    }
    const [product] = await db.update(products).set(filteredUpdates).where(eq(products.id, id)).returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return true;
  }

  async getTrendingProducts(limit: number = 10): Promise<{ product: Product; salesCount: number }[]> {
    const deliveredOrders = await db.select().from(orders).where(eq(orders.status, 'delivered'));
    const deliveredOrderIds = new Set(deliveredOrders.map(o => o.id));
    
    if (deliveredOrderIds.size === 0) {
      return [];
    }
    
    const allOrderItems = await db.select().from(orderItems)
      .where(inArray(orderItems.orderId, Array.from(deliveredOrderIds)));
    
    const salesMap = new Map<string, number>();
    for (const item of allOrderItems) {
      const currentCount = salesMap.get(item.productId) || 0;
      salesMap.set(item.productId, currentCount + item.quantity);
    }
    
    const sortedProductIds = Array.from(salesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId]) => productId);
    
    if (sortedProductIds.length === 0) {
      return [];
    }
    
    const trendingProducts = await db.select().from(products)
      .where(inArray(products.id, sortedProductIds));
    
    const result = trendingProducts
      .filter(p => p.isActive)
      .map(product => ({
        product,
        salesCount: salesMap.get(product.id) || 0
      }))
      .sort((a, b) => b.salesCount - a.salesCount);
    
    return result;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const [order] = await db.insert(orders).values({ 
      id, 
      userId: insertOrder.userId,
      addressId: insertOrder.addressId ?? null,
      orderType: insertOrder.orderType ?? "delivery",
      status: insertOrder.status ?? "pending",
      subtotal: insertOrder.subtotal,
      deliveryFee: insertOrder.deliveryFee,
      deliveryDistance: insertOrder.deliveryDistance ?? null,
      discount: insertOrder.discount ?? "0",
      total: insertOrder.total,
      paymentMethod: insertOrder.paymentMethod,
      changeFor: insertOrder.changeFor ?? null,
      notes: insertOrder.notes ?? null,
      customerName: insertOrder.customerName ?? null,
      motoboyId: insertOrder.motoboyId ?? null,
    }).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  async deleteOrder(id: string): Promise<boolean> {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
    return true;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getAllOrderItems(): Promise<OrderItem[]> {
    return await db.select().from(orderItems);
  }

  async getOrderItemsByOrderIds(orderIds: string[]): Promise<OrderItem[]> {
    if (orderIds.length === 0) return [];
    return await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const [item] = await db.insert(orderItems).values({ id, ...insertItem }).returning();
    return item;
  }

  async getBanners(): Promise<Banner[]> {
    const result = await db.select().from(banners).where(eq(banners.isActive, true));
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getBanner(id: string): Promise<Banner | undefined> {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner || undefined;
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const id = randomUUID();
    const [banner] = await db.insert(banners).values({ 
      id, 
      title: insertBanner.title,
      description: insertBanner.description ?? null,
      imageUrl: insertBanner.imageUrl,
      linkUrl: insertBanner.linkUrl ?? null,
      sortOrder: insertBanner.sortOrder ?? 0,
      isActive: insertBanner.isActive ?? true,
    }).returning();
    return banner;
  }

  async updateBanner(id: string, updates: Partial<InsertBanner>): Promise<Banner | undefined> {
    const [banner] = await db.update(banners).set(updates).where(eq(banners.id, id)).returning();
    return banner || undefined;
  }

  async deleteBanner(id: string): Promise<boolean> {
    await db.delete(banners).where(eq(banners.id, id));
    return true;
  }

  async getMotoboys(): Promise<Motoboy[]> {
    return await db.select().from(motoboys);
  }

  async getMotoboy(id: string): Promise<Motoboy | undefined> {
    const [motoboy] = await db.select().from(motoboys).where(eq(motoboys.id, id));
    return motoboy || undefined;
  }

  async getMotoboyByWhatsapp(whatsapp: string): Promise<Motoboy | undefined> {
    const [motoboy] = await db.select().from(motoboys).where(eq(motoboys.whatsapp, whatsapp));
    return motoboy || undefined;
  }

  async getOrdersByMotoboy(motoboyId: string, startDate?: Date, endDate?: Date): Promise<Order[]> {
    const conditions = [eq(orders.motoboyId, motoboyId)];
    
    if (startDate) {
      conditions.push(gte(orders.createdAt, startDate));
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      conditions.push(lte(orders.createdAt, endOfDay));
    }
    
    return await db.select().from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt));
  }

  async createMotoboy(insertMotoboy: InsertMotoboy): Promise<Motoboy> {
    const id = randomUUID();
    const [motoboy] = await db.insert(motoboys).values({ 
      id, 
      name: insertMotoboy.name,
      whatsapp: insertMotoboy.whatsapp,
      photoUrl: insertMotoboy.photoUrl ?? null,
      isActive: insertMotoboy.isActive ?? true,
    }).returning();
    return motoboy;
  }

  async updateMotoboy(id: string, updates: Partial<InsertMotoboy>): Promise<Motoboy | undefined> {
    const [motoboy] = await db.update(motoboys).set(updates).where(eq(motoboys.id, id)).returning();
    return motoboy || undefined;
  }

  async deleteMotoboy(id: string): Promise<boolean> {
    await db.delete(motoboys).where(eq(motoboys.id, id));
    return true;
  }

  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings);
    return setting || undefined;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings();
    if (!existing) {
      const id = randomUUID();
      const [setting] = await db.insert(settings).values({
        id,
        storeAddress: null,
        storeLat: null,
        storeLng: null,
        deliveryRatePerKm: "1.25",
        minDeliveryFee: "5.00",
        maxDeliveryDistance: "15",
        pixKey: null,
        openingHours: null,
        isOpen: true,
        ...updates,
      }).returning();
      return setting;
    }
    const [setting] = await db.update(settings).set(updates).where(eq(settings.id, existing.id)).returning();
    return setting;
  }

  async createStockLog(insertLog: InsertStockLog): Promise<StockLog> {
    const id = randomUUID();
    const [log] = await db.insert(stockLogs).values({ id, ...insertLog }).returning();
    return log;
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    const result = await db.select().from(deliveryZones);
    return result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getDeliveryZone(id: string): Promise<DeliveryZone | undefined> {
    const [zone] = await db.select().from(deliveryZones).where(eq(deliveryZones.id, id));
    return zone || undefined;
  }

  async createDeliveryZone(insertZone: InsertDeliveryZone): Promise<DeliveryZone> {
    const id = randomUUID();
    const [zone] = await db.insert(deliveryZones).values({
      id,
      code: insertZone.code,
      name: insertZone.name,
      description: insertZone.description ?? null,
      fee: insertZone.fee,
      sortOrder: insertZone.sortOrder ?? 0,
      isActive: insertZone.isActive ?? true,
    }).returning();
    return zone;
  }

  async updateDeliveryZone(id: string, updates: Partial<InsertDeliveryZone>): Promise<DeliveryZone | undefined> {
    const [zone] = await db.update(deliveryZones).set(updates).where(eq(deliveryZones.id, id)).returning();
    return zone || undefined;
  }

  async deleteDeliveryZone(id: string): Promise<boolean> {
    await db.delete(deliveryZones).where(eq(deliveryZones.id, id));
    return true;
  }

  async getNeighborhoods(): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods);
  }

  async getNeighborhoodsByZone(zoneId: string): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods).where(eq(neighborhoods.zoneId, zoneId));
  }

  async getNeighborhood(id: string): Promise<Neighborhood | undefined> {
    const [neighborhood] = await db.select().from(neighborhoods).where(eq(neighborhoods.id, id));
    return neighborhood || undefined;
  }

  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const id = randomUUID();
    const [neighborhood] = await db.insert(neighborhoods).values({
      id,
      name: insertNeighborhood.name,
      zoneId: insertNeighborhood.zoneId,
      isActive: insertNeighborhood.isActive ?? true,
    }).returning();
    return neighborhood;
  }

  async updateNeighborhood(id: string, updates: Partial<InsertNeighborhood>): Promise<Neighborhood | undefined> {
    const [neighborhood] = await db.update(neighborhoods).set(updates).where(eq(neighborhoods.id, id)).returning();
    return neighborhood || undefined;
  }

  async deleteNeighborhood(id: string): Promise<boolean> {
    await db.delete(neighborhoods).where(eq(neighborhoods.id, id));
    return true;
  }

  async getCuratedTrendingProducts(): Promise<(TrendingProduct & { product: Product })[]> {
    const result = await db.select()
      .from(trendingProducts)
      .innerJoin(products, eq(trendingProducts.productId, products.id))
      .orderBy(trendingProducts.sortOrder);
    
    return result.map(row => ({
      ...row.trending_products,
      product: row.products
    }));
  }

  async addTrendingProduct(productId: string): Promise<TrendingProduct> {
    const id = randomUUID();
    const existing = await db.select().from(trendingProducts).orderBy(desc(trendingProducts.sortOrder)).limit(1);
    const maxSortOrder = existing.length > 0 ? (existing[0].sortOrder ?? 0) : 0;
    
    const [trending] = await db.insert(trendingProducts).values({
      id,
      productId,
      sortOrder: maxSortOrder + 1,
    }).returning();
    return trending;
  }

  async removeTrendingProduct(id: string): Promise<boolean> {
    await db.delete(trendingProducts).where(eq(trendingProducts.id, id));
    return true;
  }

  async updateTrendingProductOrder(id: string, sortOrder: number): Promise<TrendingProduct | undefined> {
    const [updated] = await db.update(trendingProducts)
      .set({ sortOrder })
      .where(eq(trendingProducts.id, id))
      .returning();
    return updated || undefined;
  }

  async reorderTrendingProducts(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(trendingProducts)
        .set({ sortOrder: i })
        .where(eq(trendingProducts.id, orderedIds[i]));
    }
  }

  async getPasswordResetRequests(): Promise<PasswordResetRequest[]> {
    return await db.select().from(passwordResetRequests).orderBy(desc(passwordResetRequests.createdAt));
  }

  async getPendingPasswordResetRequests(): Promise<PasswordResetRequest[]> {
    return await db.select().from(passwordResetRequests)
      .where(eq(passwordResetRequests.status, "pending"))
      .orderBy(desc(passwordResetRequests.createdAt));
  }

  async createPasswordResetRequest(request: InsertPasswordResetRequest): Promise<PasswordResetRequest> {
    const id = randomUUID();
    const [resetRequest] = await db.insert(passwordResetRequests).values({
      id,
      userId: request.userId,
      userName: request.userName,
      userWhatsapp: request.userWhatsapp,
      status: "pending",
    }).returning();
    return resetRequest;
  }

  async completePasswordResetRequest(id: string, completedBy: string): Promise<PasswordResetRequest | undefined> {
    const [updated] = await db.update(passwordResetRequests)
      .set({ status: "completed", completedAt: new Date(), completedBy })
      .where(eq(passwordResetRequests.id, id))
      .returning();
    return updated || undefined;
  }

  async getShoppingLists(): Promise<ShoppingList[]> {
    return await db.select().from(shoppingLists).orderBy(desc(shoppingLists.createdAt));
  }

  async getActiveShoppingList(): Promise<ShoppingList | undefined> {
    const [list] = await db.select().from(shoppingLists).where(eq(shoppingLists.status, "active")).orderBy(desc(shoppingLists.createdAt)).limit(1);
    return list || undefined;
  }

  async getShoppingList(id: string): Promise<ShoppingList | undefined> {
    const [list] = await db.select().from(shoppingLists).where(eq(shoppingLists.id, id));
    return list || undefined;
  }

  async createShoppingList(list: InsertShoppingList): Promise<ShoppingList> {
    const [created] = await db.insert(shoppingLists).values({ id: randomUUID(), ...list }).returning();
    return created;
  }

  async updateShoppingList(id: string, list: Partial<ShoppingList>): Promise<ShoppingList | undefined> {
    const [updated] = await db.update(shoppingLists).set(list).where(eq(shoppingLists.id, id)).returning();
    return updated || undefined;
  }

  async completeShoppingList(id: string): Promise<ShoppingList | undefined> {
    const [updated] = await db.update(shoppingLists)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(shoppingLists.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteShoppingList(id: string): Promise<boolean> {
    const result = await db.delete(shoppingLists).where(eq(shoppingLists.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getShoppingListItems(listId: string): Promise<ShoppingListItem[]> {
    return await db.select().from(shoppingListItems).where(eq(shoppingListItems.listId, listId));
  }

  async createShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem> {
    const [created] = await db.insert(shoppingListItems).values({ id: randomUUID(), ...item }).returning();
    return created;
  }

  async updateShoppingListItem(id: string, item: Partial<ShoppingListItem>): Promise<ShoppingListItem | undefined> {
    const [updated] = await db.update(shoppingListItems).set(item).where(eq(shoppingListItems.id, id)).returning();
    return updated || undefined;
  }

  async markItemPurchased(id: string, purchased: boolean, actualQuantity?: number): Promise<ShoppingListItem | undefined> {
    const updateData: Partial<ShoppingListItem> = {
      isPurchased: purchased,
      purchasedAt: purchased ? new Date() : null,
    };
    if (actualQuantity !== undefined) {
      updateData.actualQuantity = actualQuantity;
    }
    const [updated] = await db.update(shoppingListItems).set(updateData).where(eq(shoppingListItems.id, id)).returning();
    return updated || undefined;
  }

  async deleteShoppingListItem(id: string): Promise<boolean> {
    const result = await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();

const SALT_ROUNDS = 10;

export async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  const allProducts = await db.select().from(products);
  
  // If database already has 41+ products, skip (seed is complete)
  if (allProducts.length >= 41) {
    console.log("Database already fully seeded, skipping...");
    return;
  }
  
  if (existingUsers.length > 0) {
    console.log("Database exists with " + allProducts.length + " products, completing seed with prepared products...");
  }

  console.log("Seeding database with initial data...");

  const adminId = randomUUID();
  const kitchenId = randomUUID();
  const pdvId = randomUUID();

  const hashedPassword = await bcrypt.hash("939393", SALT_ROUNDS);

  // Only insert users if they don't exist
  const usersExist = await db.select().from(users).limit(1);
  if (usersExist.length === 0) {
    await db.insert(users).values([
      { id: adminId, name: "Admin", whatsapp: "00000000000", role: "admin", password: hashedPassword, isBlocked: false },
      { id: kitchenId, name: "Cozinha", whatsapp: "00000000001", role: "kitchen", password: hashedPassword, isBlocked: false },
      { id: pdvId, name: "Balcao", whatsapp: "00000000002", role: "pdv", password: hashedPassword, isBlocked: false },
    ]);
  }

  // Find or get category IDs (for both new and existing categories)
  let categories_map = await db.select().from(categories);
  
  const catDestiladosId = categories_map.find(c => c.name === "Destilados")?.id || randomUUID();
  const catCervejasId = categories_map.find(c => c.name === "Cervejas")?.id || randomUUID();
  const catVinhosId = categories_map.find(c => c.name === "Vinhos")?.id || randomUUID();
  const catGelosId = categories_map.find(c => c.name === "Gelos")?.id || randomUUID();
  const catEnergeticosId = categories_map.find(c => c.name === "Energeticos")?.id || randomUUID();
  const catMisturaId = categories_map.find(c => c.name === "Misturas")?.id || randomUUID();
  const catPetiscosId = categories_map.find(c => c.name === "Petiscos")?.id || randomUUID();
  const catAguasId = categories_map.find(c => c.name === "Aguas e Sucos")?.id || randomUUID();
  
  // Prepared item categories - do NOT show stock in UI
  let catDosesId = categories_map.find(c => c.name === "DOSES")?.id;
  let catCopaoId = categories_map.find(c => c.name === "COPAO")?.id;
  let catDrinksEspeciaisId = categories_map.find(c => c.name === "DRINKS ESPECIAIS")?.id;
  let catBatidasId = categories_map.find(c => c.name === "BATIDAS")?.id;
  let catCaipirinhasId = categories_map.find(c => c.name === "CAIPIRINHAS")?.id;

  const newCategories = [];
  if (!catDosesId) { catDosesId = randomUUID(); newCategories.push({ id: catDosesId, name: "DOSES", iconUrl: "beaker", sortOrder: 9, isActive: true }); }
  if (!catCopaoId) { catCopaoId = randomUUID(); newCategories.push({ id: catCopaoId, name: "COPAO", iconUrl: "cup", sortOrder: 10, isActive: true }); }
  if (!catDrinksEspeciaisId) { catDrinksEspeciaisId = randomUUID(); newCategories.push({ id: catDrinksEspeciaisId, name: "DRINKS ESPECIAIS", iconUrl: "martini", sortOrder: 11, isActive: true }); }
  if (!catBatidasId) { catBatidasId = randomUUID(); newCategories.push({ id: catBatidasId, name: "BATIDAS", iconUrl: "wine", sortOrder: 12, isActive: true }); }
  if (!catCaipirinhasId) { catCaipirinhasId = randomUUID(); newCategories.push({ id: catCaipirinhasId, name: "CAIPIRINHAS", iconUrl: "leaf", sortOrder: 13, isActive: true }); }

  // ALWAYS insert missing regular categories first
  const regularCategoriesNeeded = [];
  if (!categories_map.find(c => c.name === "Destilados")) regularCategoriesNeeded.push({ id: catDestiladosId, name: "Destilados", iconUrl: "wine", sortOrder: 1, isActive: true });
  if (!categories_map.find(c => c.name === "Cervejas")) regularCategoriesNeeded.push({ id: catCervejasId, name: "Cervejas", iconUrl: "beer", sortOrder: 2, isActive: true });
  if (!categories_map.find(c => c.name === "Vinhos")) regularCategoriesNeeded.push({ id: catVinhosId, name: "Vinhos", iconUrl: "grape", sortOrder: 3, isActive: true });
  if (!categories_map.find(c => c.name === "Gelos")) regularCategoriesNeeded.push({ id: catGelosId, name: "Gelos", iconUrl: "snowflake", sortOrder: 4, isActive: true });
  if (!categories_map.find(c => c.name === "Energeticos")) regularCategoriesNeeded.push({ id: catEnergeticosId, name: "Energeticos", iconUrl: "zap", sortOrder: 5, isActive: true });
  if (!categories_map.find(c => c.name === "Misturas")) regularCategoriesNeeded.push({ id: catMisturaId, name: "Misturas", iconUrl: "glass-water", sortOrder: 6, isActive: true });
  if (!categories_map.find(c => c.name === "Petiscos")) regularCategoriesNeeded.push({ id: catPetiscosId, name: "Petiscos", iconUrl: "utensils", sortOrder: 7, isActive: true });
  if (!categories_map.find(c => c.name === "Aguas e Sucos")) regularCategoriesNeeded.push({ id: catAguasId, name: "Aguas e Sucos", iconUrl: "droplets", sortOrder: 8, isActive: true });

  if (regularCategoriesNeeded.length > 0) {
    await db.insert(categories).values(regularCategoriesNeeded);
  }

  // Insert prepared categories that don't exist
  if (newCategories.length > 0) {
    await db.insert(categories).values(newCategories);
  }

  const productsList = [
    // Regular inventory products
    { categoryId: catDestiladosId, name: "Vodka Absolut 1L", description: "Vodka premium sueca", costPrice: "45.00", profitMargin: "50.00", salePrice: "89.90", stock: 20, productType: "destilado" },
    { categoryId: catDestiladosId, name: "Whisky Jack Daniels 1L", description: "Whisky americano Tennessee", costPrice: "85.00", profitMargin: "45.00", salePrice: "159.90", stock: 15, productType: "destilado" },
    { categoryId: catDestiladosId, name: "Gin Tanqueray 750ml", description: "Gin britanico premium", costPrice: "55.00", profitMargin: "50.00", salePrice: "109.90", stock: 18, productType: "destilado" },
    { categoryId: catDestiladosId, name: "Vodka Smirnoff 1L", description: "Vodka classica", costPrice: "28.00", profitMargin: "60.00", salePrice: "59.90", stock: 30, productType: "destilado" },
    { categoryId: catCervejasId, name: "Heineken Long Neck 330ml", description: "Cerveja premium lager", costPrice: "3.50", profitMargin: "70.00", salePrice: "7.90", stock: 120, productType: null },
    { categoryId: catCervejasId, name: "Budweiser Long Neck 330ml", description: "Cerveja lager refrescante", costPrice: "3.00", profitMargin: "70.00", salePrice: "6.90", stock: 100, productType: null },
    { categoryId: catCervejasId, name: "Brahma Lata 350ml", description: "Cerveja brasileira tradicional", costPrice: "2.00", profitMargin: "80.00", salePrice: "4.90", stock: 200, productType: null },
    { categoryId: catVinhosId, name: "Vinho Casillero del Diablo 750ml", description: "Vinho tinto chileno", costPrice: "35.00", profitMargin: "50.00", salePrice: "69.90", stock: 20, productType: null },
    { categoryId: catGelosId, name: "Gelo Premium 2kg", description: "Gelo cristalino de alta qualidade", costPrice: "3.00", profitMargin: "100.00", salePrice: "8.00", stock: 150, productType: "gelo" },
    { categoryId: catGelosId, name: "Gelo Triturado 2kg", description: "Gelo triturado para drinks", costPrice: "4.00", profitMargin: "90.00", salePrice: "10.00", stock: 100, productType: "gelo" },
    { categoryId: catEnergeticosId, name: "Red Bull 250ml", description: "Energetico classico", costPrice: "5.00", profitMargin: "60.00", salePrice: "9.90", stock: 80, productType: "energetico" },
    { categoryId: catEnergeticosId, name: "Monster Energy 473ml", description: "Energetico potente", costPrice: "6.00", profitMargin: "55.00", salePrice: "11.90", stock: 60, productType: "energetico" },
    { categoryId: catMisturaId, name: "Agua Tonica Schweppes 350ml", description: "Agua tonica para drinks", costPrice: "2.50", profitMargin: "80.00", salePrice: "5.90", stock: 100, productType: null },
    { categoryId: catMisturaId, name: "Refrigerante Cola 350ml", description: "Refrigerante cola", costPrice: "2.00", profitMargin: "80.00", salePrice: "4.90", stock: 120, productType: null },
    { categoryId: catPetiscosId, name: "Amendoim Japones 200g", description: "Amendoim crocante", costPrice: "4.00", profitMargin: "75.00", salePrice: "8.90", stock: 60, productType: null },
    { categoryId: catAguasId, name: "Agua Mineral 500ml", description: "Agua mineral sem gas", costPrice: "1.00", profitMargin: "100.00", salePrice: "3.00", stock: 200, productType: null },
    
    // PREPARED PRODUCTS - DOSES
    { categoryId: catDosesId, name: "Dose Vodka Absolut", description: "Dose de vodka premium", costPrice: "8.00", profitMargin: "100.00", salePrice: "16.00", stock: 0, productType: null },
    { categoryId: catDosesId, name: "Dose Gin Tanqueray", description: "Dose de gin britanico", costPrice: "10.00", profitMargin: "100.00", salePrice: "20.00", stock: 0, productType: null },
    { categoryId: catDosesId, name: "Dose Whisky Jack Daniels", description: "Dose de whisky americano", costPrice: "15.00", profitMargin: "100.00", salePrice: "30.00", stock: 0, productType: null },
    { categoryId: catDosesId, name: "Dose Rum Bacardi", description: "Dose de rum premium", costPrice: "7.00", profitMargin: "100.00", salePrice: "14.00", stock: 0, productType: null },
    { categoryId: catDosesId, name: "Dose Tequila Jose Cuervo", description: "Dose de tequila mexicana", costPrice: "6.00", profitMargin: "100.00", salePrice: "12.00", stock: 0, productType: null },
    
    // PREPARED PRODUCTS - COPAO
    { categoryId: catCopaoId, name: "Copao Vodka com Energetico", description: "Vodka com Red Bull", costPrice: "12.00", profitMargin: "100.00", salePrice: "24.00", stock: 0, productType: null },
    { categoryId: catCopaoId, name: "Copao Gin Tonic", description: "Gin com agua tonica premium", costPrice: "14.00", profitMargin: "100.00", salePrice: "28.00", stock: 0, productType: null },
    { categoryId: catCopaoId, name: "Copao Whisky Cola", description: "Whisky com refrigerante cola", costPrice: "16.00", profitMargin: "100.00", salePrice: "32.00", stock: 0, productType: null },
    { categoryId: catCopaoId, name: "Copao Rum com Suco", description: "Rum com suco natural", costPrice: "10.00", profitMargin: "100.00", salePrice: "20.00", stock: 0, productType: null },
    { categoryId: catCopaoId, name: "Copao Vodka com Suco Cranberry", description: "Vodka cosmopolitan estilo", costPrice: "13.00", profitMargin: "100.00", salePrice: "26.00", stock: 0, productType: null },
    
    // PREPARED PRODUCTS - DRINKS ESPECIAIS
    { categoryId: catDrinksEspeciaisId, name: "Mojito Classico", description: "Agua, rum, limao, hortelã e acucar", costPrice: "15.00", profitMargin: "100.00", salePrice: "30.00", stock: 0, productType: null },
    { categoryId: catDrinksEspeciaisId, name: "Caipirinha de Morango", description: "Cachaça, morango fresco e gelo", costPrice: "12.00", profitMargin: "100.00", salePrice: "24.00", stock: 0, productType: null },
    { categoryId: catDrinksEspeciaisId, name: "Pina Colada", description: "Rum, leite de coco e suco de abacaxi", costPrice: "18.00", profitMargin: "100.00", salePrice: "36.00", stock: 0, productType: null },
    { categoryId: catDrinksEspeciaisId, name: "Margarita Classica", description: "Tequila, triple sec e limao", costPrice: "16.00", profitMargin: "100.00", salePrice: "32.00", stock: 0, productType: null },
    { categoryId: catDrinksEspeciaisId, name: "Cosmopolitan", description: "Vodka, triple sec, suco cranberry e limao", costPrice: "14.00", profitMargin: "100.00", salePrice: "28.00", stock: 0, productType: null },
    
    // PREPARED PRODUCTS - BATIDAS
    { categoryId: catBatidasId, name: "Batida de Morango", description: "Cachaça com morango e leite condensado", costPrice: "10.00", profitMargin: "100.00", salePrice: "20.00", stock: 0, productType: null },
    { categoryId: catBatidasId, name: "Batida de Coco", description: "Cachaça com coco ralado e leite condensado", costPrice: "10.00", profitMargin: "100.00", salePrice: "20.00", stock: 0, productType: null },
    { categoryId: catBatidasId, name: "Batida de Limao", description: "Cachaça com limao fresco e acucar", costPrice: "8.00", profitMargin: "100.00", salePrice: "16.00", stock: 0, productType: null },
    { categoryId: catBatidasId, name: "Batida de Abacaxi", description: "Cachaça com polpa de abacaxi", costPrice: "9.00", profitMargin: "100.00", salePrice: "18.00", stock: 0, productType: null },
    { categoryId: catBatidasId, name: "Batida de Maracuja", description: "Cachaça com suco de maracuja fresco", costPrice: "11.00", profitMargin: "100.00", salePrice: "22.00", stock: 0, productType: null },
    
    // PREPARED PRODUCTS - CAIPIRINHAS
    { categoryId: catCaipirinhasId, name: "Caipirinha Tradicional", description: "Cachaça, limao verde e acucar", costPrice: "10.00", profitMargin: "100.00", salePrice: "20.00", stock: 0, productType: null },
    { categoryId: catCaipirinhasId, name: "Caipirinha de Maracuja", description: "Cachaça com maracuja fresco", costPrice: "12.00", profitMargin: "100.00", salePrice: "24.00", stock: 0, productType: null },
    { categoryId: catCaipirinhasId, name: "Caipirinha de Melancia", description: "Cachaça com melancia da estacao", costPrice: "11.00", profitMargin: "100.00", salePrice: "22.00", stock: 0, productType: null },
    { categoryId: catCaipirinhasId, name: "Caipirinha de Gengibre", description: "Cachaça com gengibre e limao", costPrice: "9.00", profitMargin: "100.00", salePrice: "18.00", stock: 0, productType: null },
    { categoryId: catCaipirinhasId, name: "Caipirinha Premium Black", description: "Cachaça seleta premium com limao nobre", costPrice: "15.00", profitMargin: "100.00", salePrice: "30.00", stock: 0, productType: null },
  ];

  for (const prod of productsList) {
    await db.insert(products).values({
      id: randomUUID(),
      categoryId: prod.categoryId,
      name: prod.name,
      description: prod.description,
      imageUrl: null,
      costPrice: prod.costPrice,
      profitMargin: prod.profitMargin,
      salePrice: prod.salePrice,
      stock: prod.stock,
      isActive: true,
      productType: prod.productType,
    });
  }

  await db.insert(settings).values({
    id: randomUUID(),
    storeAddress: "Rua das Bebidas, 123 - Centro",
    storeLat: null,
    storeLng: null,
    deliveryRatePerKm: "1.25",
    minDeliveryFee: "5.00",
    maxDeliveryDistance: "15",
    pixKey: "vibedrinks@pix.com",
    openingHours: null,
    isOpen: true,
  });

  console.log("Database seeded successfully!");
}
