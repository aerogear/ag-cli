async function asyncWait(delay: number = 3000): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(() => resolve(), delay);
  });
}

export async function poll(
  f: () => any,
  cond: (o: any) => boolean,
  delay: number = 1000,
  timeout: number = 10000,
  timeoutMessage: string = 'Timeout'
): Promise<any> {
  const start: number = new Date().getTime();
  let res = await f();
  while (!cond(res)) {
    await asyncWait(delay);
    res = await f();
    if (timeout !== 0 && new Date().getTime() - start > timeout) {
      throw {
        message: timeoutMessage,
      };
    }
  }

  return res;
}
