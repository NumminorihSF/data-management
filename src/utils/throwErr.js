export default function throwErr(err) {
  setImmediate(() => {
    throw err;
  });
}
