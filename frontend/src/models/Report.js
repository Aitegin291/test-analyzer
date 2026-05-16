// ООП: Класс, описывающий сущность "Отчет"
export class ReportModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.totalTests = data.total_tests || 0;
    this.failed = data.failed || 0;
    this.createdAt = new Date(data.created_at);
    this.rawLogs = data.raw_logs || { tests: [] };
  }

  // Метод класса (Инкапсуляция логики расчета внутри объекта)
  get successRate() {
    if (this.totalTests === 0) return 0;
    return (((this.totalTests - this.failed) / this.totalTests) * 100).toFixed(1);
  }

  get formattedDate() {
    return this.createdAt.toLocaleString('ru-RU', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  }
}