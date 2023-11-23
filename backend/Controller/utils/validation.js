const Joi = require('joi'); 
const reguarExp = new RegExp();

const validator = (schema)=>(payload)=>{
  return  schema.validate(payload)
}

const mobileSchema = Joi.object().keys({ 
  mobile_number:  Joi.number().min(1000000000).max(9999999999).messages({'number.max': `Phone number must have 10 digits.`,'number.min': `Phone number must have 10 digits.`}).required()
});

const mobileOtpSchema = Joi.object().keys({ 
  mobile_number:  Joi.number().min(1000000000).max(9999999999).messages({'number.max': `Phone number must have 10 digits.`,'number.min': `Phone number must have 10 digits.`}).required(),
  otp: Joi.number().min(1000).max(9999).messages({"number.max":'otp must have 4 digit',"number.min":'otp must have 4 digit'}).required()
}); 

const singUpSchema = Joi.object().keys({ 
  fullname: Joi.string().min(3).max(30).required().regex(/^[A-Z]'?[- a-zA-Z]*( [a-zA-Z])*$/i).messages({"string.pattern.base":"Please enter alphabets only"}),
  location_name:Joi.string().min(3).max(300).required().regex(/^.{5,}[a-zA-Z]+[0-9]*$/i).messages({"string.pattern.base":"only alphanumerice and space are allow"}),
  role:Joi.string().valid("merchant","admin").optional().lowercase(),
  mobile_number:Joi.number().min(1000000000).max(9999999999).messages({'number.max': `Phone number must have 10 digits.`,'number.min': `Phone number must have 10 digits.`}).required(),
  latitude:Joi.number().min(-90).max(90).required(),
  longitude:Joi.number().min(-180).max(180).required(),
});

const editUserSchema = Joi.object().keys({ 
  fullname: Joi.string().min(3).max(30).optional().regex(/^[A-Z]'?[- a-zA-Z]*( [a-zA-Z])*$/i).messages({"string.pattern.base":"Please enter alphabets only"}),
  location_name:Joi.string().min(3).max(40).optional().regex(/^.{3,}[a-zA-Z]+[0-9]*$/i).messages({"string.pattern.base":"only alphanumerice and space are allow and minimum 3 letter"}),
  latitude:Joi.number().min(-90).max(90).optional(),
  longitude:Joi.number().min(-180).max(180).optional(),
  gender:Joi.string().valid("male","female").optional().lowercase()

});

const turfSchema = Joi.object().keys({
turfname: Joi.string().min(3).max(30).required(),
playground:Joi.number().min(1).max(9).required(),
services:Joi.array().items(Joi.string().valid()).required(),
location_name:Joi.string().min(3).max(40).optional().regex(/^\w+(?:\s+\w+)*$/).messages({"string.pattern.base":"only alphanumerice and space are allow"}),
latitude:Joi.number().min(-90).max(90).required().optional(),
longitude:Joi.number().min(-180).max(180).required().optional()});

const razorpayAccountSchema = Joi.object().keys({ 
  fullname: Joi.string().min(3).max(30).optional().regex(/^[A-Z]'?[- a-zA-Z]*( [a-zA-Z])*$/i).messages({"string.pattern.base":"Please enter alphabets only"}),
  location_name:Joi.string().min(3).max(40).optional().regex(/^.{3,}[a-zA-Z]+[0-9]*$/i).messages({"string.pattern.base":"only alphanumerice and space are allow and minimum 3 letter"}),
  latitude:Joi.number().min(-90).max(90).optional(),
  longitude:Joi.number().min(-180).max(180).optional(),
  gender:Joi.string().valid("male","female").optional().lowercase()

});

exports.validateNumber = validator(mobileSchema);
exports.validateNumberOtp = validator(mobileOtpSchema);
exports.validationSingUp = validator(singUpSchema);

exports.validationUpdateUser = validator(editUserSchema);
exports.validationRazorpayAccount = validator(razorpayAccountSchema);
