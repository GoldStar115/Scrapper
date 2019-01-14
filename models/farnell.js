var mongoose=require('mongoose');
var components = 'electrical';
var modelname = 'FarnellDB-' + components;
var  farnellSchema=new mongoose.Schema({
    title:{
        type : String,
        default: ' '
      },
    thumbnail:{
        type : String,
        default: ' '
      },
    datasheet :{
        type : String,
        default: ' '
      },
    datasheetTitle : {
        type : String,
        default: ' '
      },
    description:{
      type : String,
      default: ' '
    },
    price  : {
      type : String,
      default : '0'
    }
  });

mongoose.model(modelname,farnellSchema);
