export async function safeAsync<T>(
  fn: Promise<T>,
): Promise<[data: null, error: Error] | [data: T, error: null]> {
  try {
    const data = await fn;
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}
