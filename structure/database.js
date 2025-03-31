const mysql = require('mysql2/promise');

module.exports = class MyData {
    constructor(client) {
        this.client = client;
        this.dbConfig = {
            host: 'localhost',
            user: 'root',   //  
            password: '',   //  
            database: 'coins', // 
        };

        this.init();
    }

    async init() {
        try {
            this.db = await mysql.createConnection(this.dbConfig);
            console.log('✅ Connexion à la base de données réussie !');
            this.client.startHandlers(); 

            await this.createTables();
        } catch (error) {
            console.error('❌ Erreur de connexion à la base de données :', error);
        }
    }

    async createTables() {
        try {
            // Vérifier et créer la table `users`
            await this.createTable("guilds", [
                { name: "guildId", type: "VARCHAR(25) PRIMARY KEY" }, 
                { name: "lang", type: "TEXT NOT NULL" }, 
                { name: "prefix", type: "VARCHAR(10) DEFAULT NULL" }, 
                { name: "embedColor", type: "VARCHAR(7) DEFAULT NULL" }, 
                { name: "ownerBot", type: "TEXT DEFAULT NULL" }, 
                { name: "whitelist", type: "TEXT DEFAULT NULL" }, 
                { name: "blChannel", type: "TEXT DEFAULT NULL" } 
            ]);

            console.log("✅ Toutes les tables et colonnes sont vérifiées !");
        } catch (error) {
            console.error('❌ Erreur création tables:', error);
        }
    }

    async createTable(tableName, columns) {
        try {
            const columnsSQL = columns.map(col => `${col.name} ${col.type}`).join(", ");
            await this.db.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSQL})`);

            const existingColumns = await this.getTableColumns(tableName);
            for (const column of columns) {
                if (!existingColumns.includes(column.name)) {
                    await this.db.query(`ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`);
                    console.log(`✅ Colonne ajoutée : ${column.name} dans ${tableName}`);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur création/vérification table '${tableName}':`, error);
        }
    }

    async getTableColumns(tableName) {
        try {
            const [rows] = await this.db.query(`SHOW COLUMNS FROM ${tableName}`);
            return rows.map(row => row.Field);
        } catch (error) {
            console.error(`❌ Erreur récupération colonnes de '${tableName}':`, error);
            return [];
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.db.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Erreur SQL :', error);
            return null;
        }
    }
};
