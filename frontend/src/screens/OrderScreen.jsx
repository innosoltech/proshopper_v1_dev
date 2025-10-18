import { useParams, Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Badge,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import PaystackPop from "@paystack/inline-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  // useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
  useInitiateTransMutation, // NOTE: FOR BACKEND PAYSTACK
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  // console.log(orderId);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // console.log(order);

  // NOTE: FOR BACKEND PAYSTACK
  // const {
  //   data: access_code,
  //   refetch: refetchingAccessCode,
  //   // isLoading: loadingCode,
  //   // error: loadingErrorCode,
  // } = useGetAccessCodeQuery(orderId);

  // console.log("reference: " + order.reference);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // NOTE: FOR BACKEND PAYSTACK
  const [initiateTrans, { isLoading: loadingTransaction }] =
    useInitiateTransMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // const {
  //   data: paypal,
  //   isLoading: loadingPayPal,
  //   error: errorPayPal,
  // } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!errorPayPal && !loadingPayPal && paypal.clientId) {
  //     const loadPayPalScript = async () => {
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": paypal.clientId,
  //           currency: "USD",
  //         },
  //       });
  //       paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  //     };
  //     if (order && !order.isPaid) {
  //       if (!window.paypal) {
  //         loadPayPalScript();
  //       }
  //     }
  //   }
  // }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       await payOrder({ orderId, details }).unwrap();
  //       refetch();
  //       toast.success("Payment Successful!");
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.message);
  //     }
  //   });
  // }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } }).unwrap();
    refetch();
    toast.success("Payment Successful!");
  }

  // function onError(err) {
  //   toast.error(err.message);
  // }

  // function createOrder(data, actions) {
  //   return actions.order
  //     .create({
  //       purchase_units: [
  //         {
  //           amount: {
  //             value: order.totalPrice,
  //           },
  //         },
  //       ],
  //     })
  //     .then((orderId) => {
  //       return orderId;
  //     });
  // }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // NOTE: PAYSTACK PAYMENT SCREEN - FRONTEND UI ONLY
  // const payWithPaystackHandler = async (event) => {
  //   // event.preventDefault();

  //   const popup = new PaystackPop();
  //   popup.newTransaction({
  //     key: process.env.PAYSTACK_LIVE_PUBLIC_KEY,
  //     key: process.env.PAYSTACK_TEST_PUBLIC_KEY,
  //     reference: order.reference,
  //     channels: ["card", "mobile_money"],
  //     currency: "GHS",
  //     amount: Math.trunc(order.totalPrice * 100),
  //     name: order.user.name,
  //     email: order.user.email,
  //     phone: order.shippingAddress.phoneNumber,
  //   });
  // };

  // NOTE: METHOD 1 - FOR BACKEND PAYSTACK - INITIATING TRANSACTION THROUGH BACKEND
  async function payWithPaystackHandler() {
    const response = await initiateTrans(orderId);

    const access_code = response.data.data.access_code; // access code derived from backend response

    if (response.data.status === true) {
      const popup = new PaystackPop();

      popup.resumeTransaction(access_code); // access code derived from backend response. Method 2 is to retrieve access code from useGetAccessCodeQuery()
    } else {
      console.log("Transaction could not be started");
    }
    // console.log("The order (from orderScreen): " + order);
    // console.log("The access code (from orderScreen): " + accessCode);

    // console.log(popup);

    // refetch();
  }
  // PAYSTACK PAYMENT SCREEN END

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      {/* <h1>Order: {order._id}</h1> */}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>
                <Badge bg="primary">Order ID: {order._id}</Badge>
              </h4>
            </ListGroup.Item>
            <ListGroup.Item className="text-bg-colour">
              <h4>Shipping/Delivery</h4>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {order.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.area}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="text-bg-colour">
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
                {/* {order.paymentMethod} */}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on: {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Item(s)</h4>
              {order.orderItems.map((orderItem, index) => (
                <ListGroup.Item key={index} className="card-strip">
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <Image
                        src={orderItem.image}
                        alt={orderItem.name}
                        fluid
                        rounded
                        className="fitObject"
                      />
                    </Col>

                    <Col className="product-title">
                      <Link to={`/product/${orderItem.product}`}>
                        {orderItem.name}
                      </Link>
                    </Col>

                    <Col xs={4} sm={4}>
                      {orderItem.qty} x ₵{orderItem.price} = ₵
                      {orderItem.qty * orderItem.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Order Item(s)</Col>
                  <Col>₵{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping/Delivery</Col>
                  <Col>₵{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>₵{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>₵{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* <ListGroup.Item>
                <p
                  style={{
                    fontSize: "small",
                    color: "blue",
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Card payment does not require a PayPal account
                </p>
              </ListGroup.Item> */}

              <ListGroup.Item>
                <p
                  style={{
                    fontSize: "x-small",
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold",
                    color: "red",
                    // textTransform: "uppercase",
                  }}
                >
                  Use "Test Pay" button to test payment. "Pay Now" button is a
                  live payment button that triggers the payment process.
                </p>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <div>
                        <Button
                          variant="outline-primary"
                          onClick={onApproveTest}
                          style={{ marginBottom: "10px" }}
                        >
                          <strong>Test Pay</strong>
                        </Button>
                      </div>

                      <Button
                        variant="primary"
                        onClick={payWithPaystackHandler}
                        style={{ marginBottom: "10px" }}
                      >
                        Pay Now
                      </Button>

                      {/* <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div> */}
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
