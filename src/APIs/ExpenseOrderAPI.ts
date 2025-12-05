import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { ExpenseOrderStatus } from "@/enums/ExpenseOrderEnums";
import { 
    ExpenseType,
    ExpenseOrder,
    ExpenseOrderStats,
    CreateExpenseOrderData,
    UpdateExpenseOrderData,
    SubmitExpenseOrderData,
    ApproveExpenseOrderData,
    RejectExpenseOrderData,
    ProcessPaymentData
} from "../types";

const API_PATH = '/api/expense-orders';

export class ExpenseOrderAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // ==================== JOURNALIST METHODS ====================

  public async createExpenseOrder(data: CreateExpenseOrderData): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(API_PATH, data);
  }

  public async updateExpenseOrder(expenseOrderId: string, data: UpdateExpenseOrderData): Promise<ExpenseOrder> {
    return this._put<ExpenseOrder>(`${API_PATH}/${expenseOrderId}`, data);
  }

  public async submitExpenseOrder(expenseOrderId: string, data?: SubmitExpenseOrderData): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(`${API_PATH}/${expenseOrderId}/submit`, data || {});
  }

  public async cancelExpenseOrder(expenseOrderId: string, reason?: string): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(`${API_PATH}/${expenseOrderId}/cancel`, { reason });
  }

  public async getMyExpenseOrders(pagination: PaginationObject = DEFAULT_PAGINATION, status?: ExpenseOrderStatus): Promise<PaginatedCollection<ExpenseOrder>> {
    const params: any = { ...pagination };
    if (status) params.status = status;
    return this._list<ExpenseOrder>(`${API_PATH}/my-orders`, params);
  }

  // ==================== ADMIN/FINANCE MANAGER METHODS ====================

  public async getAllExpenseOrders(pagination: PaginationObject = DEFAULT_PAGINATION, filters?: { status?: number; channelId?: string; journalistId?: string }): Promise<PaginatedCollection<ExpenseOrder>> {
    const params: any = { ...pagination };
    if (filters?.status !== undefined) params.status = filters.status;
    if (filters?.channelId) params.channelId = filters.channelId;
    if (filters?.journalistId) params.journalistId = filters.journalistId;
    return this._list<ExpenseOrder>('/api/admin/expense-orders', params);
  }

  public async approveExpenseOrder(expenseOrderId: string, data?: ApproveExpenseOrderData): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(`${API_PATH}/${expenseOrderId}/approve`, data || {});
  }

  public async rejectExpenseOrder(expenseOrderId: string, data: RejectExpenseOrderData): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(`${API_PATH}/${expenseOrderId}/reject`, data);
  }

  public async processPayment(expenseOrderId: string, data?: ProcessPaymentData): Promise<ExpenseOrder> {
    return this._post<ExpenseOrder>(`${API_PATH}/${expenseOrderId}/process-payment`, data || {});
  }

  public async getPendingExpenseOrders(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<ExpenseOrder>> {
    return this._list<ExpenseOrder>(`${API_PATH}/pending`, pagination);
  }

  public async getExpenseOrderStats(channelId?: string, startDate?: Date, endDate?: Date): Promise<ExpenseOrderStats> {
    const params: any = {};
    if (channelId) params.channelId = channelId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    return this._get<ExpenseOrderStats>(`${API_PATH}/stats`, { params });
  }

  // ==================== GENERAL METHODS ====================

  public async getExpenseOrder(expenseOrderId: string): Promise<ExpenseOrder> {
    return this._get<ExpenseOrder>(`${API_PATH}/${expenseOrderId}`);
  }

  public async getExpenseOrdersByJournalist(journalistId: string, pagination: PaginationObject = DEFAULT_PAGINATION, status?: ExpenseOrderStatus): Promise<PaginatedCollection<ExpenseOrder>> {
    const params: any = { ...pagination };
    if (status) params.status = status;
    return this._list<ExpenseOrder>(`${API_PATH}/journalist/${journalistId}`, params);
  }

  public async getExpenseOrdersByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION, status?: ExpenseOrderStatus): Promise<PaginatedCollection<ExpenseOrder>> {
    const params: any = { ...pagination };
    if (status) params.status = status;
    return this._list<ExpenseOrder>(`${API_PATH}/channel/${channelId}`, params);
  }

  public async getExpenseTypes(): Promise<ExpenseType[]> {
    return this._get<ExpenseType[]>('/api/expense-types');
  }
} 