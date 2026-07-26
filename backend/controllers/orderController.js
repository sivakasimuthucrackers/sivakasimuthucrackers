import mongoose from "mongoose";

import Order from "../models/Order.js";
import Setting from "../models/Setting.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateInvoice } from "../utils/generateInvoice.js";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function generateOrderNumber() {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `MC${datePart}${randomPart}`;
}

function createItemsHtml(items = []) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border:1px solid #ddd;">
            ${item.name}
          </td>

          <td style="padding:10px;border:1px solid #ddd;text-align:center;">
            ${item.quantity}
          </td>

          <td style="padding:10px;border:1px solid #ddd;text-align:right;">
            ${formatCurrency(item.subtotal)}
          </td>
        </tr>
      `
    )
    .join("");
}

function createCustomerEmail(order) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#222;">
      <div style="background:#ec0874;color:#fff;padding:24px;text-align:center;">
        <h1 style="margin:0;">
          Sivakasi Muthu Crackers
        </h1>
      </div>

      <div style="padding:24px;border:1px solid #eee;">
        <h2>Order Confirmation</h2>

        <p>
          Dear ${order.customer.name},
        </p>

        <p>
          Thank you for placing your order. Our team will contact you shortly
          to confirm availability, delivery and payment details.
        </p>

        <p>
          <strong>Order Number:</strong>
          ${order.orderNumber}
          <br />

          <strong>Total Amount:</strong>
          ${formatCurrency(order.totalAmount)}
          <br />

          <strong>Order Status:</strong>
          ${order.orderStatus}
          <br />

          <strong>Payment Status:</strong>
          ${order.paymentStatus}
        </p>

        <table style="width:100%;border-collapse:collapse;margin-top:20px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px;border:1px solid #ddd;text-align:left;">
                Product
              </th>

              <th style="padding:10px;border:1px solid #ddd;">
                Qty
              </th>

              <th style="padding:10px;border:1px solid #ddd;text-align:right;">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            ${createItemsHtml(order.items)}
          </tbody>
        </table>

        <p style="margin-top:24px;">
          Regards,
          <br />

          <strong>
            Sivakasi Muthu Crackers
          </strong>
          <br />

          Phone: +91 96003 33302
          <br />

          WhatsApp: +91 70104 00258
        </p>
      </div>
    </div>
  `;
}

function createAdminEmail(order) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#222;">
      <div style="background:#111;color:#fff;padding:24px;">
        <h1 style="margin:0;">
          New Order Received
        </h1>
      </div>

      <div style="padding:24px;border:1px solid #eee;">
        <p>
          <strong>Order Number:</strong>
          ${order.orderNumber}
          <br />

          <strong>Customer:</strong>
          ${order.customer.name}
          <br />

          <strong>Mobile:</strong>
          ${order.customer.mobile}
          <br />

          <strong>Email:</strong>
          ${order.customer.email || "Not provided"}
          <br />

          <strong>Total:</strong>
          ${formatCurrency(order.totalAmount)}
          <br />

          <strong>Payment Method:</strong>
          ${order.paymentMethod}
        </p>

        <p>
          <strong>Delivery Address:</strong>
          <br />

          ${order.customer.address},
          <br />

          ${order.customer.city},
          ${order.customer.district},
          <br />

          ${order.customer.state} -
          ${order.customer.pincode}
        </p>

        <table style="width:100%;border-collapse:collapse;margin-top:20px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px;border:1px solid #ddd;text-align:left;">
                Product
              </th>

              <th style="padding:10px;border:1px solid #ddd;">
                Qty
              </th>

              <th style="padding:10px;border:1px solid #ddd;text-align:right;">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            ${createItemsHtml(order.items)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function createInitialWhatsAppUrl(order) {
  const message = [
    "Hello Sivakasi Muthu Crackers,",
    "",
    "I have placed an order.",
    "",
    `Order Number: ${order.orderNumber}`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.mobile}`,
    `Total: ${formatCurrency(order.totalAmount)}`,
    "",
    "Please confirm my order.",
    "",
    "Thank you.",
  ].join("\n");

  return `https://wa.me/917010400258?text=${encodeURIComponent(
    message
  )}`;
}

export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderNumber:
        req.body.orderNumber || generateOrderNumber(),
    };

    const settings = await Setting.findOne();

    const minimumOrder =
      settings?.minimumOrderValue || 0;

    if (Number(req.body.totalAmount) < minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value is ₹${minimumOrder}`,
      });
    }

    const order = await Order.create(orderData);

    const invoiceBuffer = await generateInvoice(order);

    const invoiceAttachment = {
      filename: `Invoice-${order.orderNumber}.pdf`,
      content: invoiceBuffer,
      contentType: "application/pdf",
    };

    const emailResults = {
      customer: null,
      admin: null,
    };

    if (order.customer.email) {
      emailResults.customer = await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: createCustomerEmail(order),
        attachments: [invoiceAttachment],
      });
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      "sivakasimuthucrackers@gmail.com";

    emailResults.admin = await sendEmail({
      to: adminEmail,
      subject: `New Order Received - ${order.orderNumber}`,
      html: createAdminEmail(order),
      attachments: [invoiceAttachment],
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
      whatsappUrl: createInitialWhatsAppUrl(order),
      emailResults,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $match: {
          "customer.mobile": {
            $exists: true,
            $nin: ["", null],
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $group: {
          _id: "$customer.mobile",

          name: {
            $first: "$customer.name",
          },

          mobile: {
            $first: "$customer.mobile",
          },

          email: {
            $first: "$customer.email",
          },

          address: {
            $first: "$customer.address",
          },

          city: {
            $first: "$customer.city",
          },

          district: {
            $first: "$customer.district",
          },

          state: {
            $first: "$customer.state",
          },

          pincode: {
            $first: "$customer.pincode",
          },

          gstNumber: {
            $first: "$customer.gstNumber",
          },

          totalOrders: {
            $sum: 1,
          },

          totalSpent: {
            $sum: {
              $cond: [
                {
                  $ne: [
                    "$orderStatus",
                    "Cancelled",
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },

          lastOrderDate: {
            $max: "$createdAt",
          },

          orders: {
            $push: {
              _id: "$_id",
              orderNumber: "$orderNumber",
              totalAmount: "$totalAmount",
              orderStatus: "$orderStatus",
              paymentStatus: "$paymentStatus",
              paymentMethod: "$paymentMethod",
              items: "$items",
              createdAt: "$createdAt",
            },
          },
        },
      },

      {
        $sort: {
          lastOrderDate: -1,
        },
      },

      {
        $project: {
          _id: 0,
          customerId: "$_id",
          name: 1,
          mobile: 1,
          email: 1,
          address: 1,
          city: 1,
          district: 1,
          state: 1,
          pincode: 1,
          gstNumber: 1,
          totalOrders: 1,
          totalSpent: 1,
          lastOrderDate: 1,
          orders: 1,
        },
      },
    ]);

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const identifier = String(
      req.params.identifier || ""
    ).trim();

    const conditions = [
      {
        orderNumber: identifier,
      },
    ];

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      conditions.push({
        _id: identifier,
      });
    }

    const order = await Order.findOne({
      $or: conditions,
    }).select(
      "orderNumber customer.name customer.mobile totalAmount paymentMethod orderStatus paymentStatus createdAt"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
function createStatusUpdateEmail({
  order,
  recipientType,
  previousOrderStatus,
  previousPaymentStatus,
}) {
  const isCustomer = recipientType === "customer";

  return `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#222;">

      <div style="background:#ec0874;color:#fff;padding:22px;text-align:center;">
        <h1 style="margin:0;font-size:26px;">
          Sivakasi Muthu Crackers
        </h1>
      </div>

      <div style="padding:24px;border:1px solid #eeeeee;">

        <h2 style="margin-top:0;">
          ${
            isCustomer
              ? "Your Order Status Has Been Updated"
              : "Order Status Updated"
          }
        </h2>

        ${
          isCustomer
            ? `
              <p>
                Dear ${order.customer?.name || "Customer"},
              </p>

              <p>
                Your order status has been updated.
                Please find the latest details below.
              </p>
            `
            : `
              <p>
                An order was updated from the Admin Panel.
              </p>
            `
        }

        <table style="width:100%;border-collapse:collapse;margin-top:20px;">
          <tbody>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Order Number
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${order.orderNumber}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Customer
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${order.customer?.name || "-"}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Previous Order Status
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${previousOrderStatus || "-"}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Current Order Status
              </td>

              <td style="padding:10px;border:1px solid #ddd;color:#ec0874;font-weight:bold;">
                ${order.orderStatus}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Previous Payment Status
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${previousPaymentStatus || "-"}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Current Payment Status
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${order.paymentStatus}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">
                Total Amount
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${formatCurrency(order.totalAmount)}
              </td>
            </tr>

          </tbody>
        </table>

        ${
          order.orderStatus === "Confirmed"
            ? `
            <div style="margin-top:20px;padding:15px;background:#e8fff0;border-left:4px solid green;">
              ✅ Your order has been confirmed.
              Our team will contact you shortly.
            </div>
          `
            : ""
        }

        ${
          order.orderStatus === "Shipped"
            ? `
            <div style="margin-top:20px;padding:15px;background:#eef6ff;border-left:4px solid blue;">
              🚚 Your order has been shipped.
            </div>
          `
            : ""
        }

        ${
          order.orderStatus === "Delivered"
            ? `
            <div style="margin-top:20px;padding:15px;background:#effff2;border-left:4px solid green;">
              🎉 Your order has been delivered.
              Thank you for shopping with us.
            </div>
          `
            : ""
        }

        ${
          order.orderStatus === "Cancelled"
            ? `
            <div style="margin-top:20px;padding:15px;background:#fff0f0;border-left:4px solid red;">
              ❌ Your order has been cancelled.
            </div>
          `
            : ""
        }

        <p style="margin-top:30px;">
          Regards,
          <br>

          <strong>
            Sivakasi Muthu Crackers
          </strong>

          <br>

          Phone :
          +91 96003 33302

          <br>

          WhatsApp :
          +91 70104 00258

        </p>

      </div>

    </div>
  `;
}

function createStatusWhatsAppUrl(order) {

  const mobile = String(
    order.customer?.mobile || ""
  ).replace(/\D/g, "");

  if (!mobile) return null;

  const customerMobile =
    mobile.length === 10
      ? `91${mobile}`
      : mobile;

  const statusMessages = {

    Pending:
      "Your order is currently Pending.",

    Confirmed:
      "Your order has been Confirmed.",

    Shipped:
      "Your order has been Shipped.",

    Delivered:
      "Your order has been Delivered.",

    Cancelled:
      "Your order has been Cancelled.",

  };

  const message = [

    `Hello ${order.customer?.name},`,

    "",

    "Your Sivakasi Muthu Crackers order has been updated.",

    "",

    `Order Number : ${order.orderNumber}`,

    `Order Status : ${order.orderStatus}`,

    `Payment Status : ${order.paymentStatus}`,

    `Total Amount : ${formatCurrency(order.totalAmount)}`,

    "",

    statusMessages[order.orderStatus],

    "",

    "Thank you.",

    "Sivakasi Muthu Crackers",

    "Phone : +91 96003 33302",

  ].join("\n");

  return `https://wa.me/${customerMobile}?text=${encodeURIComponent(
    message
  )}`;

}
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    const previousOrderStatus = order.orderStatus;
    const previousPaymentStatus = order.paymentStatus;

    if (req.body.orderStatus) {
      order.orderStatus = req.body.orderStatus;
    }

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
    }

    const orderStatusChanged =
      previousOrderStatus !== order.orderStatus;

    const paymentStatusChanged =
      previousPaymentStatus !== order.paymentStatus;

    if (!orderStatusChanged && !paymentStatusChanged) {
      return res.json({
        success: true,
        message: "No status change detected",
        order,
        emailResults: {
          customer: null,
          admin: null,
        },
        whatsappUrl: null,
        customerNotificationRequired: false,
      });
    }

    await order.save();

    const emailResults = {
      customer: null,
      admin: null,
    };

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      "sivakasimuthucrackers@gmail.com";

    if (order.customer?.email) {
      emailResults.customer = await sendEmail({
        to: order.customer.email,
        subject: `Order Update - ${order.orderNumber} - ${order.orderStatus}`,
        html: createStatusUpdateEmail({
          order,
          recipientType: "customer",
          previousOrderStatus,
          previousPaymentStatus,
        }),
      });
    } else {
      emailResults.customer = {
        success: false,
        skipped: true,
        reason: "Customer email address is not available",
      };
    }

    emailResults.admin = await sendEmail({
      to: adminEmail,
      subject: `Order Status Updated - ${order.orderNumber}`,
      html: createStatusUpdateEmail({
        order,
        recipientType: "admin",
        previousOrderStatus,
        previousPaymentStatus,
      }),
    });

    const whatsappUrl =
      createStatusWhatsAppUrl(order);

    res.json({
      success: true,
      message: order.customer?.email
        ? "Order updated and notification emails processed"
        : "Order updated. Customer email is unavailable; send the WhatsApp notification.",
      order,
      emailResults,
      whatsappUrl,
      customerNotificationRequired:
        !order.customer?.email,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    await Order.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};