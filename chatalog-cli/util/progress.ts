export default class Progress {
  private current: number;
  private total: number;

  constructor(total: number, current = 0) {
    this.current = current;
    this.total = total;
  }

  plus() {
    this.current++;
  }

  log(message?: any) {
    console.log(`[${this.current}/${this.total}] ${message}`);
  }
}
