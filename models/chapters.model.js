import mongoose from 'mongoose';

const chaptersSchema = new mongoose.Schema(
  {
    slug : {
        type : String,
        required : true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
   content: {
   
   },
    chaptersNumber: {
    type : Number,
    required : true,
    }
  },
  { timestamps: true }
);

const Chapters = mongoose.model('Chapters', chaptersSchema);

export default Chapters;
