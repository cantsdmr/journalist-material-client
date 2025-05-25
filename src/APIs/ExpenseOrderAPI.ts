import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { ExpenseOrderStatus } from "@/enums/ExpenseOrderEnums";
import { User } from "./UserAPI";
import { Channel } from "./ChannelAPI";

export type ExpenseType = {
  id: number;
  name: string;
};

export type PaymentMethod = {
  id: string;
  type: string;
  details: string;
  isDefault: boolean;
};

export type ExpenseOrder = {
  id: string;
  journalist: User;
  channel: Channel;
  type: ExpenseType;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: ExpenseOrderStatus;
  receipt_url?: string;
  notes?: string;
  approver?: User;
  approved_at?: Date;
  rejection_reason?: string;
  paymentMethod?: PaymentMethod;
  paid_at?: Date;
  payment_reference?: string;
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateExpenseOrderData = {
  channelId: string;
  typeId: number;
  title: string;
  description: string;
  amount: number;
  currency?: string;
  receiptUrl?: string;
  notes?: string;
};

export type UpdateExpenseOrderData = {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  typeId?: number;
  receiptUrl?: string;
  notes?: string;
};

export type SubmitExpenseOrderData = {
  paymentMethodId?: string;
};

export type ApproveExpenseOrderData = {
  notes?: string;
};

export type RejectExpenseOrderData = {
  rejectionReason: string;
};

export type ProcessPaymentData = {
  paymentReference?: string;
};

export type ExpenseOrderStats = {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  paid: number;
  cancelled: number;
  totalAmount: number;
  totalPaidAmount: number;
};

const API_PATH = '/api/expense-orders';

export class ExpenseOrderAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // Journalist methods
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

  // Admin/Finance Manager methods
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

  // General methods
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

  // Get expense types (assuming this endpoint exists)
  public async getExpenseTypes(): Promise<ExpenseType[]> {
    return this._get<ExpenseType[]>('/api/expense-types');
  }
} 