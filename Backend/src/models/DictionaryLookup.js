const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const DictionaryLookup = sequelize.define(
    "DictionaryLookup",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        word: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },

        // phiên âm (nếu có)
        phonetic: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },

        // ngôn ngữ, mặc định EN
        language: {
            type: DataTypes.STRING(8),
            allowNull: false,
            defaultValue: "en",
        },

        // nguồn dữ liệu (vd: dictionaryapi.dev)
        source: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },

        // kết quả tra cứu (JSON → lưu TEXT để tương thích MSSQL)
        resultJson: {
            type: DataTypes.TEXT, // NVARCHAR(MAX)
            allowNull: true,
            get() {
                const raw = this.getDataValue("resultJson");
                try {
                    return raw ? JSON.parse(raw) : null;
                } catch {
                    return raw;
                }
            },
            set(val) {
                this.setDataValue(
                    "resultJson",
                    val == null ? null : JSON.stringify(val)
                );
            },
        },

        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "DictionaryLookups",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { fields: ["word"] },
            { fields: ["language"] },
            { fields: ["createdAt"] },
        ],
    }
);

module.exports = DictionaryLookup;
