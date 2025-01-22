//1. Типы данных для моделей
// Интерфейс продукта
interface Product {
    id: string; //уникальный идентификатор товара ID
    title: string; //наименование товара
    description: string; //описание товара
    image: string; // url изображения товара
    category: string; //категория товара
    price: number | null //стоимость товара
}
//класс продукта
class ProductClass implements Product {
    private _id: string;
    private _title: string;
    private _description: string;
    private _image: string;
    private _category: string;
    private _price: number | null; 

    constructor(id: string, title: string, description: string, image: string, category: string, price: number | null) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._image = image;
        this._category = category;
        this._price = price;
    }
    //Геттеры и сеттеры для соответствия интерфейсу
    get id(): string {
        return this._id;
    }
    get title(): string {
        return this._title;
    }
    get description(): string {
        return this._description;
    }
    get image(): string {
        return this._image;
    }
    get category(): string {
        return this._category;
    }
    get price(): number | null {
        return this._price;
    }
    set price(value: number | null) {
        this._price = value;
    }

    static getCatalog(products: Product[]): Product[] {
        return products;
    }
    static populateCatalog(products: Product[]): void {
        console.log("В каталог добавлен товар:", products);
    }
}

//2. Типы данных для заказов
interface CustomerData {
    name: string; //имя покупателя
    email: string; //адрес электронной почты
    phone: string; //номер телефона
    address: string; //адрес доставки
    cartItems: Product[]; //список товаров в корзине
    paymentMethod: string; //способ оплаты
}
//класс для заказа
class CustomerDataClass implements CustomerData {
    private _name: string;
    private _email: string;
    private _phone: string;
    private _address: string;
    private _cartItems: Product[];
    private _paymentMethod: string;

    constructor(name: string, email: string, phone: string, address: string, paymentMethod: string) {
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._address = address;
        this._cartItems = [];
        this._paymentMethod = paymentMethod;
    }
    //Геттеры и сеттеры для соответствия интерфейсов
    get name(): string {
        return this._name;
    }
    
    get email(): string {
        return this._email;
    }
    
    get phone(): string {
        return this._phone;
    }
    
    get address(): string {
        return this._address;
    }
    
    get cartItems(): Product[] {
        return this._cartItems;
    }
    
    get paymentMethod(): string {
        return this._paymentMethod;
    }
    
    set paymentMethod(value: string) {
        this._paymentMethod = value;
    }

    addToCart(product: Product): void {
        this._cartItems.push(product);
        console.log(`${product.title} доавлен в корзину.`);
    }
    
    removeFromCart(productId: string): void {
        this._cartItems = this._cartItems.filter((product) => product.id !== productId);
        console.log(`Товар с ID ${productId} удален из корзины.`);
    }
    
    getCartTotal(): number {
        return this._cartItems.reduce((total, product) => total + (product.price || 0), 0);
    }
    
    clearCart(): void {
        this._cartItems = [];
        console.log("Корзина очищена.");
    }
    
    validateData(): boolean {
        if (!this._name || !this._email || !this._phone || !this._address) {
          console.error("Все поля должны быть заполнены.");
          return false;
        }
        return true;
    }
}

//3. Интерфейс API-клиента
interface ApiClient {
    fetchProducts(): Promise<Product[]>; //получение списка товаров
    submitOrder(order: CustomerData): Promise<{id: string; total: number}>; //Отправка заказа
}

class ApiClientClass implements ApiClient {
    private _baseUrl: string;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }
    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    async fetchProducts(): Promise<Product[]> {
        const response = await fetch(`${this.baseUrl}/product/`);
        const data = await response.json();
        return data.items;
    }

    async submitOrder(order: CustomerData): Promise<{ id: string; total: number}> {
        const response = await fetch(`${this.baseUrl}/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        return response.json();
    }
}

//4. Интерфейс базового класса EventEmitter
interface EventEmitter {
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
}

class EventEmitterClass implements EventEmitter {
    private events: Map<string, Function[]> = new Map();

    on(event: string, callback: (...args: any[]) => void): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)?.push(callback);
    }

    off(event: string, callback: (...args: any[]) => void): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
          this.events.set(event, callbacks.filter(cb => cb !== callback));
        }
      }
    
      emit(event: string, ...args: any[]): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
          callbacks.forEach(callback => callback(...args));
        }
      }
}

// 5. Перечисление событий
enum AppEvents {
    PRODUCT_ADDED = "productAdded",
    PRODUCT_REMOVED = "productRemoved",
    ORDER_COMPLETED = "orderCompleted",
    CART_UPDATED = "cartUpdated",
  }
  
// 6. Интерфейс для отображений
interface View {
    renderProducts(products: Product[]): void; // Отображение списка товаров
    updateCart(cart: Product[]): void;         // Обновление корзины
    showOrderSummary(order: CustomerData): void;      // Отображение информации о заказе
}
  
class ViewClass implements View {
    renderProducts(products: Product[]): void {
      console.log("Продукты:", products);
    }
  
    public updateCart(cart: Product[]): void {
      console.log("Корзина обновлена:", cart);
    }
  
    public showOrderSummary(order: CustomerData): void {
      console.log("Заказ:", order);
    }
  }