const { SendEmailCommand } = require("@aws-sdk/client-ses");

const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "This is the message body in HTML format.",
        },
  
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Hello from dev-tinder",
      },
    },
    Source: fromAddress,
  });
};

const sendEmail = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "mohseenkhan468@gmail.com",
    "mohsinkhanmewati468@gmail.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { sendEmail };