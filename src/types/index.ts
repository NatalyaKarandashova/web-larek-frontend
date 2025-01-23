//1. Типы данных для моделей
// Интерфейс продукта
interface Product {
    id: number; //уникальный идентификатор товара ID
    title: string; //наименование товара
    description: string; //описание товара
    image: string; // url изображения товара
    category: string; //категория товара
    price: number | null //стоимость товара
}
//класс продукта
class ProductClass implements Product {
    private _id: number;
    private _title: string;
    private _description: string;
    private _image: string;
    private _category: string;
    private _price: number | null; 

    constructor(id: number, title: string, description: string, image: string, category: string, price: number | null) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._image = image;
        this._category = category;
        this._price = price;
    }
    //Геттеры и сеттеры для соответствия интерфейсу
    get id(): number {
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
}

//интерфейс ProductCatalog
interface ProductCatalog {
    getCatalog(): Product[];
    populateCatalog(products: Product[]): void;
}

class ProductCatalogClass implements ProductCatalog {
    private _products: Product[] = [];

    // Возвращает список продуктов
    getCatalog(): Product[] {
        return this._products;
    }

    // Заполняет каталог продуктов
    populateCatalog(products: Product[]): void {
        this._products = products;
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
    
    removeFromCart(productId: number): void {
        this._cartItems = this._cartItems.filter(item => item.id !== productId);
    }
    
    getCartTotal(): number {
        return this._cartItems.reduce((total, item) => total + item.price, 0);
    }
    
    clearCart(): void {
        this._cartItems = [];
        console.log("Корзина очищена.");
    }
    
    validateData(): boolean {
        return !!(this.name && this.email && this.phone && this.address && this.paymentMethod);
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
    renderContent(content: any): void; // Отрисовывает переданный контент
    updateUI(data: any): void;        // Обновляет пользовательский интерфейс
  }
  
class ViewClass implements View {
    renderContent(content: any): void {
      console.log("Rendering content:", content);
    }
  
    updateUI(data: any): void {
      console.log("Updating UI with data:", data);
    }
}

interface PaymentData {
    paymentMethod: string; // "online" | "cash"
    address: string;
}

interface ContactData {
    email: string;
    phone: string;
}

//Класс для экрана витрины
class MainScreen extends ViewClass {
    showProducts(products: Product[]): void {
      this.renderContent(products);
      console.log("Displaying products on the main screen:", products);
    }
}
  
//Класс для экрана деталей товара
class ProductDetailsScreen extends ViewClass {
    showProductDetails(product: Product): void {
      this.renderContent(product);
      console.log("Детали товара отображены", product);
    }
}
  
//Класс для экрана корзины
class CartScreen extends ViewClass {
    showCart(cart: Product[]): void {
        this.renderContent(cart);
        console.log("Содержимое корзины отображено.");
    }
}

//Класс для экрана выбора способа оплаты и адреса доставки
class CheckoutPaymentScreen extends ViewClass {
    showPaymentForm(): void {
        this.renderContent("Форма выбора способа оплаты и ввода адреса");
        console.log("Форма оплаты отображена.");
    }

    collectPaymentData(): PaymentData {
        console.log("Сбор данных о платеже.");
        return { paymentMethod: "online", address: "123 Example Street" };
    }
}
  
//Класс для экрана ввода email и телефона
class CheckoutContactScreen extends ViewClass {
    showContactForm(): void {
        this.renderContent("Форма ввода контактных данных");
        console.log("Форма ввода email и телефона отображена.");
    }

    collectContactData(): ContactData {
        console.log("Сбор контактных данных.");
        return { email: "example@example.com", phone: "+1234567890" };
    }
}
  
//Класс для экрана успешного завершения заказа
class SuccessScreen extends ViewClass {
    showSuccessMessage(): void {
        this.renderContent("Ваш заказ успешно оформлен!");
        console.log("Сообщение об успешном заказе отображено.");
    }
}