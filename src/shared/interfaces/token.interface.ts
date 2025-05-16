import { Schema } from 'mongoose';

export interface IToken {
  id: Schema.Types.ObjectId;
  expiresIn: number;
}

export default IToken;
