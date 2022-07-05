declare let hrtime: {
    (previousTimestamp?: [number, number]): [number, number];
    bigint(time?: [number, number]): bigint;
};
export = hrtime;
