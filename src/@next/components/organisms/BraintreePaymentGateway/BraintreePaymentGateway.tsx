import React, { useState, useEffect } from "react";

import * as S from "./styles";
import { IProps } from "./types";

import { useCart } from "@saleor/sdk";

import * as dropin from "braintree-web-drop-in";


const BraintreePaymentGateway: React.FC<IProps> = ({
  config,
  processPayment,
  formRef,
  formId,
  errors = [],
  postalCode,
  onError,
}: IProps) => {

// get the price and amout from the cart only necessary for paypal
  const cartApi = useCart();
  const amount = cartApi.totalPrice?.net.amount || 0;
  const currency = cartApi.totalPrice?.net.currency || "EUR";


  const [ setSubmitErrors] = useState<IFormError[]>([]);
//
//   const [cardErrors, setCardErrors] = React.useState<ErrorData>(
//        INITIAL_CARD_ERROR_STATE
// );

  const clientToken = config.find(({ field }) => field === "client_token")
    ?.value || "";
  // console.log("%o", clientToken);


  useEffect(() => {
    var myContainer = document.getElementById('dropin-ui-button');

    (async () => {
      const myOptions: dropin.Options = {
        authorization: clientToken,
        container: myContainer,
        locale: "de-DE",
        translations: {},
        paymentOptionPriority: ["card", "paypal", "googlePay", "applePay"],
        card: {
          cardholderName: {
            required: false
          },
          overrides: {
            fields: {},
            styles: {}
          },
          clearFieldsAfterTokenization: false,
          vault: {
            allowVaultCardOverride: false,
            vaultCard: false
          }
        },
        paypal: {
          flow: "checkout",
          amount: amount,
          currency: currency,
          commit: false
        },
        applePay: {
          displayName: "name",
          applePaySessionVersion: 1,
          paymentRequest: {}
        },
        googlePay: {
          merchantId: "",
          googlePayVersion: "",
          currency: currency,
          transactionInfo: {
            totalPrice: amount,
            currencyCode: currency,
            totalPriceStatus: "FINAL",
            countryCode: "DE"
          },
          button: {}
        },
        dataCollector: {
          kount: false,
          paypal: false
        },
        threeDSecure: {
          amount: "1"
        },
        vaultManager: false,
        preselectVaultedPaymentMethod: false
      };
      const myDropin = await dropin.create(myOptions);

      myDropin.clearSelectedPaymentMethod();
      const myBool: boolean = myDropin.isPaymentMethodRequestable();

      function onNoPaymentMethodRequestable() {
        return;
      }
      function onPaymentMethodRequestable({ type, paymentMethodIsSelected }: dropin.PaymentMethodRequestablePayload) {
        const myType: "CreditCard" | "PayPalAccount" = type;
        const myBool: boolean = paymentMethodIsSelected;
      }
      function onPaymentOptionSelected({ paymentOption }: dropin.PaymentOptionSelectedPayload) {
        const myPaymentOption: "card" | "paypal" | "paypalCredit" = paymentOption;
      }

      myDropin.on("noPaymentMethodRequestable", onNoPaymentMethodRequestable);
      myDropin.on("paymentMethodRequestable", onPaymentMethodRequestable);
      myDropin.on("paymentOptionSelected", onPaymentOptionSelected);

      myDropin.off("noPaymentMethodRequestable", onNoPaymentMethodRequestable);
      myDropin.off("paymentMethodRequestable", onPaymentMethodRequestable);
      myDropin.off("paymentOptionSelected", onPaymentOptionSelected);

      // myDropin.requestPaymentMethod((error: any, payload: any) => {
      //   if (error) {
      //     const requestPaymentError = [
      //       {
      //         message: JSON.stringify(error)
      //       },
      //     ];
      //     onError(requestPaymentError);
      //     return;
      //   }
      // });

      const myPayload = await myDropin.requestPaymentMethod();
      const details: object = myPayload.details;
      const deviceData: string | null = myPayload.deviceData;
      const nonce: string = myPayload.nonce;
      const type: "CreditCard" | "PayPalAccount" | "AndroidPayCard" | "ApplePayCard" = myPayload.type;

      myDropin.teardown((error: any) => {
        if (error) {
          const tearDownError = [
            {
              message: JSON.stringify(error)
            },
          ];
          onError(tearDownError);
          return;
        }
      });
      await myDropin.teardown();
    })();

    // function customFunction(options: dropin.Options) {
    //   return;
    // }
  },
      []);

  // const handleSubmit = async (formData: ICardInputs) => {
  //   setSubmitErrors([]);
  //   const creditCard: ICardPaymentInput = {
  //     billingAddress: { postalCode },
  //     cvv: removeEmptySpaces(maybe(() => formData.ccCsc, "") || ""),
  //     expirationDate: removeEmptySpaces(maybe(() => formData.ccExp, "") || ""),
  //     number: removeEmptySpaces(maybe(() => formData.ccNumber, "") || ""),
  //   };
  //   const payment = await tokenizeCcCard(creditCard);
  //   if (payment?.token) {
  //     processPayment(payment?.token, {
  //       brand: payment?.ccType,
  //       firstDigits: null,
  //       lastDigits: payment?.lastDigits,
  //       expMonth: null,
  //       expYear: null,
  //     });
  //   } else {
  //     const braintreePayloadErrors = [
  //       {
  //         message:
  //           "Payment submission error. Braintree gateway returned no token in payload.",
  //       },
  //     ];
  //     setSubmitErrors(braintreePayloadErrors);
  //     onError(braintreePayloadErrors);
  //   }
  // };

  // const allErrors = [
  //     // ...errors,
  //   // ...submitErrors
  // ];

  return (
    <S.Wrapper>
      <div id="dropin-ui-button" />
      {/*<ErrorMessage errors={allErrors} />*/}
    </S.Wrapper>
  );
};



export { BraintreePaymentGateway }