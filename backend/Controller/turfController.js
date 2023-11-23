const cloudinary = require("cloudinary").v2;
const allUser = require("../Models/allUserModels");
const Turf = require("../Models/turfModels");
const USER = require("../Models/userModels");
const BOOKING = require("../Models/bookingModels");
const notification = require("../Middlewares/notification");
const jwt = require("../Middlewares/jwt");
const { bookingValidation } = require("../Middlewares/slots");

exports.nearestfindTurf = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const location = await USER.findOne({
      user_id: req?.token?.id,
    });
    let cordinat = location?.location?.coordinates;
    if (latitude && longitude) {
      let data = await Turf.find(
        {
          location: {
            $geoWithin: {
              $centerSphere: [[latitude, longitude], 5 / 3963.2],
            },
          },
        },
        {
          turfname: 1,
          location_name: 1,
          rating: 1,
        }
      );
      return res.status(200).json({
        data: data,
      });
    } else if (location) {
      let data = await Turf.find(
        {
          location: {
            $geoWithin: {
              $centerSphere: [[cordinat[0], cordinat[1]], 5 / 3963.2],
            },
          },
        },
        {
          turfname: 1,
          location_name: 1,
        }
      );
      return res.json({
        data: {
          data,
        },
      });
    } else {
      return res.status(200).json({
        message: "Kindly choose your current location.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getTurfDeatails = async (req, res) => {
  try {
    turfDeatails = await Turf.findOne(
      {
        _id: req.params.turf_id,
      },
      {
        turfname: 1,
        location_name: 1,
        playground: 1,
        playground_list: 1,
        rating: 1,
        photos: 1,
        services: 1,
        available: 1,
      }
    );
    if (!turfDeatails) {
      return res.status(200).json({
        success: false,
        message: "No data found",
      });
    }
    return res.status(200).json({
      data: turfDeatails,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.playgroundDeatails = async (req, res) => {
  try {
    const { date, day } = req.query;
    let playgroundDetails = Object.values(req.query).slice(2);
    let turf_id = req.params.turf_id;
    let availableTime = [];
    let validate = await bookingValidation(
      availableTime,
      date,
      day,
      playgroundDetails,
      turf_id
    );
    if (validate == false) {
      return res.status(200).json({
        message: "Slots reserved already.",
      });
    }
    if (validate == true) {
      return res.status(200).json({
        availableTime,
      });
    }
    throw new Error(validate)
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
//image upload
exports.uploadProfile = async (req, res) => {
  try {
    let profile_images = "notInserted";
    if (req.files) {
      let profile_image = req.files.profile_image;
      profile_images = await cloudinary.uploader.upload(
        profile_image.tempFilePath,
        (err, result) => {}
      );
      const profile = await Turf.findOneAndUpdate(
        {
          _id: req.params.turf_id,
        },
        {
          profile_image: profile_images.url,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Image upload successfull.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Image is not upload",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let images = await Turf.findById(req.params.turf_id, {
      profile_image: 1,
    });
    if (images) {
      return res.status(200).json({
        success: true,
        profileImage: images,
      });
    }
    return res.status(200).json({
      message: "Kindly upload your profile.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.imagesUpload = async (req, res) => {
  try {
    let profile_images = "notInserted";
    if (req.files) {
      let profile_image = Array.isArray(req.files.profile_image)
        ? req.files.profile_image
        : [req.files.profile_image];
      const turfImages = await Turf.findOne(
        {
          _id: req.params.turf_id,
        },
        {
          photos: 1,
          _id: 0,
        }
      );
      let turfImage = turfImages.photos;
      for (let data of profile_image) {
        profile_images = await cloudinary.uploader.upload(
          data.tempFilePath,
          (err, result) => {
            if (err) {
              return res.status(400).json({
                message: err.message,
              });
            }
          }
        );
        console.log(turfImages);
        if (turfImage.length < 10) {
          turfImage.push(profile_images.url);
        } else {
          return res.status(400).json({
            message: "you can't upload images",
          });
        }
      }
      const profile = await Turf.findOneAndUpdate(
        {
          _id: req.params.turf_id,
        },
        {
          photos: turfImage,
        }
      );
      return res.status(200).json({
        message: "Image upload succefully.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Please select an image",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getImages = async (req, res) => {
  try {
    let images = await Turf.findById(req.params.turf_id, {
      photos: 1,
    });
    if (images) {
      return res.status(200).json({
        turfImages: images.photos,
      });
    }
    return res.status(400).json({
      message: "Image of turf not present!",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    const urlArray = imageUrl.split("/");
    const image = urlArray[urlArray.length - 1].split(".")[0];
    await Turf.findByIdAndUpdate(req.params.turf_id, {
      $unset: {
        profile_image: "",
      },
    });
    let profile_images = await cloudinary.uploader.destroy(
      image,
      (err, result) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          return res.status(200).json({
            message: "Image delete successfull",
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.showAllTurf = async (req, res) => {
  try {
    let allTurf = await Turf.find(
      {
        verify: true,
      },
      {
        turfname: 1,
        location_name: 1,
        rating: 1,
      }
    );
    return res.status(200).json({
      success: true,
      turfList: allTurf,
    });
  } catch (err) {
    return res.status(500).json({
        message: err.message,
    });
  }
};

exports.TurfDeatails = async (req, res) => {
  try {
    let user = await allUser.findById({
      _id: req.token._id,
    });
    let turfDeatails;
    if (user.role == "admin" || user.role == "merchant") {
      console.log(req.params);
      turfDeatails = await Turf.findOne({
        _id: req.params.turf_id,
      });
      console.log(turfDeatails);
      if (!turfDeatails) {
        return res.status(200).json({
          message: "No turf found",
        });
      }
      user = await allUser.findById({
        _id: turfDeatails.marchent_id,
      });
      return res.status(200).json({
        message: "success",
        data: turfDeatails,
        user,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.changStatus = async (req, res) => {
  try {
    let { status } = req.query;
    if (status == "true") {
      await Turf.findByIdAndUpdate(req.params.turf_id, {
        $set: {
          status: true,
        },
      });
    } else {
      await Turf.findByIdAndUpdate(req.params.turf_id, {
        $set: {
          status: false,
        },
      });
    }
    return res.status(200).json({
      message: "Status change successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.createTurf = async function (req, res) {
  try {
    const {
      turfname,
      latitude,
      longitude,
      location_name,
      playground,
      playground_list,
      services,
      available,
    } = req.body;
    let dataUSer = await allUser.findOne({
      _id: req.token.id,
    });
    if (dataUSer.role == "merchant") {
      const location = {
        type: "Point",
        coordinates: [latitude, longitude],
      };
      const marchent_id = req.token.id;
      const turfDeatail = await Turf.create({
        turfname,
        marchent_id,
        location,
        location_name,
        playground,
        playground_list,
        services,
        available,
      });
      return res.status(201).json({
        success: true,
        message: "Turf register successfully",
        turfDeatail,
      });
    }
    return res.status(401).json({
      message: "You can not create turf.",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.getAllturfs = async (req, res) => {
  try {
    const turfList = await Turf.find(
      {},
      {
        turfname: 1,
        location_name: 1,
        rating: 1,
      }
    );
    if (!turfList) {
      return res.status(200).json({
        message: "No turf details found",
      });
    }
    return res.status(200).json({
      data: turfList,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//admin
exports.verificationRequest = async (req, res) => {
  try {
    let turfRequest = await Turf.find(
      {
        verify: false,
      },
      {
        turfname: 1,
        location_name: 1,
      }
    )
      .populate("marchent_id")
      .exec();
    if (!turfRequest) {
      return res.status(200).json({
        message: "Request not found for turf verification",
      });
    }
    return res.status(200).json({
      message: "Verification request",
      data: turfRequest,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.verified = async (req, res) => {
  try {
    const { turf_id, flage } = req.query;
    let turfRequest = await Turf.findOneAndUpdate(
      {
        _id: turf_id,
      },
      {
        $set: {
          verify: flage,
        },
      }
    );
    if (turfRequest) {
      if (flage == "true") {
        return res.status(200).json({
          message: "Turf has verified ",
        });
      } else if (flage == "false") {
        return res.status(200).json({
          message: "Turf has unverified",
        });
      }
    }
    return res.status(200).json({
      message: "Please enter valied details",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
