import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    const { name, mobile, phone, email, message } = req.body;
    const contactNumber = mobile || phone || "";

    if (!name || !contactNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile and message are required",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      mobile: contactNumber,
      email: email || "",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.status = req.body.status || enquiry.status;
    await enquiry.save();

    res.json({
      success: true,
      message: "Enquiry status updated",
      enquiry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
