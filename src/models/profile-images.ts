import { DataTypes } from "sequelize";
import { CoreEntity } from "../types/core-entity";
import sequelize from "../db/sequelize";

export interface ProfileImageAtributes{
    name: string;
    avatar: Buffer;
    user: string; 
}

export class ProfileImage extends CoreEntity{
    public name!: string;
    public avatar!: Buffer;
    public user!: string;
}


ProfileImage.initModel(
    {
        name: {type: DataTypes.STRING, allowNull: true},
        avatar: {type: DataTypes.BLOB, allowNull: true},
        user: {type: DataTypes.STRING, allowNull: true}
    },{
        modelName: 'profileImage',
        sequelize
    }
)