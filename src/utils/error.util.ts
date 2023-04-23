function isFileError(err: any): err is NodeJS.ErrnoException {
  return (
    err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT'
  );
}

export { isFileError };
