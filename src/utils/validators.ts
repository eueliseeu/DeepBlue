export const isValidPort = (port: string): boolean => {
  const portNum = parseInt(port, 10);
  return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
};

export const normalizePort = (port: string): number => {
  return parseInt(port, 10);
};

export const isValidVersion = (version: string): boolean => {
  return version.trim().length > 0;
};
