import * as chakra from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { BiError, BiCheck } from "react-icons/bi";
import Loader from "../../../commons/Loader";

const baseUrlApi = "https://as-solutions-backend-production.up.railway.app";
const fontName = "Inter";

export default function Login() {
  const toast = chakra.useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.email) {
      setEmailErr("Email is required!");
      hasError = true;
    }

    if (!formData.password) {
      setPasswordErr("Password is required!");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrlApi}/api/administrations/login-account`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      setStatus(response.data.status);
      setStatusCode(response.data.statusCode);
      setMessage(response.data.message);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      const { response } = err;

      if (!response) {
        setStatus("error");
        setStatusCode(408);
        setMessage(
          `Oops! The connection to the server took too long and timed out.
                    Please check your internet connection and try again.
                    `
        );
        return;
      }
      switch (response.data.statusCode) {
        case 400:
          setStatus("error");
          setStatusCode(400);
          setMessage(response.data.message);
          break;
        case 401:
          setStatus("error");
          setStatusCode(401);
          setMessage(response.data.message);
          break;
        case 404:
          setStatus("error");
          setStatusCode(404);
          setMessage(response.data.message);
          break;
        default:
          setStatus("error");
          setStatusCode(500);
          setMessage(response.data.message);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <chakra.Box minH='100vh' bg='rgb(241,241,241)'>
          <chakra.Container maxW="xs">
            <chakra.Box pt={32}>
              <form onSubmit={handleSignIn}>
                <chakra.Text
                  fontFamily={fontName}
                  fontSize={"2xl"}
                  fontWeight={"600"}
                  color="gray.800"
                >
                  Think it. Make it.
                  <br />
                </chakra.Text>
                <chakra.Text
                  fontFamily={fontName}
                  fontSize={"2xl"}
                  fontWeight={"600"}
                  color="gray.800"
                >
                  Log in to your account!
                </chakra.Text>

                <chakra.Text
                  mt="10"
                  fontFamily={fontName}
                  fontSize={"sm"}
                  color="gray.600"
                >
                  Email
                </chakra.Text>

                <chakra.Input
                  mt={2}
                  size="sm"
                  rounded="md"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  color="black"
                  bg='rgb(255,255,255)'
                  borderColor={emailErr ? "red.500" : "gray.400"}
                  _hover={{ borderColor: emailErr ? "red.500" : "gray.400" }}
                />

                {emailErr && (
                  <chakra.Text color="red.500" fontSize={"sm"}>
                    {emailErr}
                  </chakra.Text>
                )}

                <chakra.Text
                  mt="5"
                  fontFamily={fontName}
                  fontSize={"sm"}
                  color="gray.600"
                >
                  Password
                </chakra.Text>

                <chakra.Input
                  mt={2}
                  size="sm"
                  rounded="md"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  bg='rgb(255,255,255)'
                  borderColor={passwordErr ? "red.500" : "gray.400"}
                  _hover={{ borderColor: passwordErr ? "red.500" : "gray.400" }}
                  color="black"
                />

                {passwordErr && (
                  <chakra.Text color="red.500" fontSize={"sm"}>
                    {passwordErr}
                  </chakra.Text>
                )}

                {status === "success" && message && (
                  <chakra.Box
                    p="4"
                    mt="5"
                    rounded="sm"
                    border="0px"
                    borderColor="black"
                  >
                    <chakra.Stack direction={"row"} spacing={2}>
                      <chakra.IconButton
                        icon={
                          <chakra.Box fontSize={"1.3rem"}>
                            <BiCheck color="black" />
                          </chakra.Box>
                        }
                        bg="transparent"
                        _hover={{ bg: "transparent" }}
                        _focus={{ bg: "transparent" }}
                        size="sm"
                      />
                      <chakra.Text
                        color="black"
                        fontFamily={fontName}
                        fontSize={"sm"}
                        fontWeight={"600"}
                        mt="1"
                      >
                        {message}
                      </chakra.Text>
                    </chakra.Stack>
                  </chakra.Box>
                )}

                {status === "error" && message && (
                  <chakra.Box
                    p="4"
                    mt="5"
                    rounded="sm"
                    border="0px"
                    borderColor="black"
                  >
                    <chakra.Stack direction={"row"} spacing={2}>
                      <chakra.IconButton
                        icon={
                          <chakra.Box fontSize={"1.3rem"}>
                            <BiError color="red" />
                          </chakra.Box>
                        }
                        bg="transparent"
                        _hover={{ bg: "transparent" }}
                        _focus={{ bg: "transparent" }}
                        size="sm"
                      />
                      <chakra.Text
                        color="red.500"
                        fontFamily={fontName}
                        fontSize={"sm"}
                        fontWeight={"600"}
                        mt="1"
                      >
                        {message}
                      </chakra.Text>
                    </chakra.Stack>
                  </chakra.Box>
                )}

                <chakra.Button
                  mt="5"
                  width="full"
                  bg="rgb(9, 9, 9)"
                  color="white"
                  fontSize={"sm"}
                  rounded="md"
                  size="sm"
                  fontFamily={fontName}
                  _hover={{ bg: "rgb(9, 9, 9)" }}
                  type="submit"
                  isDisabled={isLoading}
                >
                  {isLoading ? <chakra.Spinner /> : "Continue"}
                </chakra.Button>
              </form>
            </chakra.Box>
          </chakra.Container>
        </chakra.Box>
      )}
    </>
  );
}
