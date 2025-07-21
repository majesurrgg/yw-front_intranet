import api from '../api';
import type {
  Beneficiary,
  BeneficiaryEnums,
  CreateBeneficiaryDto,
  UpdateBeneficiaryDto,
  BeneficiaryListResponse,
} from '../../interfaces/beneficiary.interface';

export default class BeneficiaryService {
  private static formatBeneficiaryData(
    data: CreateBeneficiaryDto | UpdateBeneficiaryDto
  ): any {
    const formatted = { ...data };
    Object.keys(formatted).forEach((key) => {
      if (formatted[key as keyof typeof formatted] === '') {
        formatted[key as keyof typeof formatted] = undefined;
      }
    });
    return formatted;
  }

  static async getAll(
    page = 1,
    limit = 10,
    search = '',
    status?: string
  ): Promise<BeneficiaryListResponse> {
    const response = await api.get<BeneficiaryListResponse>(
      '/beneficiary/page',
      {
        params: { page, limit, search, status },
      }
    );
    return response.data;
  }

  static async getById(id: number): Promise<Beneficiary> {
    const response = await api.get<Beneficiary>(
      `/beneficiary/find-one/${id}`
    );
    return response.data;
  }

  static async create(data: CreateBeneficiaryDto): Promise<Beneficiary> {
    const formattedData = this.formatBeneficiaryData(data);
    const response = await api.post<Beneficiary>(
      '/beneficiary',
      formattedData
    );
    return response.data;
  }

  static async update(
    id: number,
    data: UpdateBeneficiaryDto
  ): Promise<Beneficiary> {
    const formattedData = this.formatBeneficiaryData(data);
    const response = await api.patch<Beneficiary>(
      `/beneficiary/update/${id}`,
      formattedData
    );
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/beneficiary/soft-delete/${id}`);
  }

  static async restore(id: number): Promise<void> {
    await api.patch(`/beneficiary/restore/${id}`);
  }

  static async getEnums(): Promise<BeneficiaryEnums> {
    const response = await api.get<BeneficiaryEnums>('/beneficiary/enums');
    return response.data;
  }

  static async importFromExcel(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/beneficiary/upload-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}
