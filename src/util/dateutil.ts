import dayjs from 'dayjs';

class DateUtil {
  public isAfter(timestamp: number): boolean {
    return dayjs().isAfter(dayjs.unix(timestamp));
  }

  public addDate(
    expirationTimeValue: number,
    expirationTimeUnit: string
  ): number {
    return dayjs().add(Number(expirationTimeValue), expirationTimeUnit).unix();
  }
}

export default new DateUtil();
