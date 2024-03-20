import mysql from 'mysql';

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT!,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'music',
});

export const dbQuery = (str: string) =>
    new Promise<{ data: any; fields?: mysql.FieldInfo[] }>((resolve, reject) => {
        db.query(str, (err, data, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve({ data, fields });
            }
        });
    });
