export type TimerTypes = "5" | "3" | "1"

export default class TimerManager {
    private OneSec: NodeJS.Timer;
    private ThreeSec: NodeJS.Timer;
    private FiveSec: NodeJS.Timer;

  private oneSecCallbacks: Function[] = []
  private threeSecCallbacks: Function[] = [];
  private fiveSecCallbacks: Function[] = [];

  constructor() {
    this.OneSec = setInterval(() => {
        this.oneSecCallbacks.forEach((f) => f())
    }, 1000)

      this.ThreeSec = setInterval(() => {
          this.threeSecCallbacks.forEach((f) => f())
      }, 3000)

      this.FiveSec = setInterval(() => {
          this.fiveSecCallbacks.forEach((f) => f())
      }, 5000)
  }

  public on(timer: TimerTypes, callback: Function) {
    switch (timer) {
      case "1":
        this.oneSecCallbacks.push(callback);
          break
      case "3":
        this.threeSecCallbacks.push(callback);
        break;
      case "5":
        this.fiveSecCallbacks.push(callback);
        break;
      default:
        break;
    }
  }
}
