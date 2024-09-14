export async function withPool<T>(
  poolSize: number,
  items: T[],
  callback: (item: NoInfer<T>) => Promise<void>,
) {
  const executing = new Set<Promise<void>>();
  const allPromises: Promise<unknown>[] = [];

  for (const item of items) {
    if (executing.size >= poolSize) {
      await Promise.race(executing);
    }
    const promise = callback(item);
    executing.add(promise);
    promise.finally(() => {
      executing.delete(promise);
    });
    executing.add(promise);
    allPromises.push(promise);
  }

  await Promise.all(allPromises);
}
