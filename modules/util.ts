export default class Util {

    /**
 * Formats a number of seconds into a human readable time string
 * @param time Time in seconds
 * @returns String of the time in the format of "HH:MM:SS"
 */
public static formatTime(time: string | number) {
    time = parseInt(time.toString());
  
    const h = Math.floor(time / 3600);
    time = time % 3600;
    const m = Math.floor(time / 60);
    time = time % 60;
  
    return `${this.parseNumber(h)}:${this.parseNumber(m)}:${this.parseNumber(time)}`;
  }
  
  private static parseNumber(s: number) {
    return s.toString().length == 1 ? `0${s}` : s;
  }



}