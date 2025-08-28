"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

// Tipos para los viajes
export interface Travel {
  id: number;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  itinerary: string;
}

// Tipos para las reservas
export interface BookingRequest {
  bookingDate: string;
  status: string;
  userId: number;
  travelId: number;
}

export interface BookingResponse {
  id: number;
  bookingDate: string;
  status: string;
  user: {
    id: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
  };
  travel: {
    id: number;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: number;
    itinerary: string;
  };
  payments: {
    id: number;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
  }[];
}

// Tipos para los pagos
export interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  bookingId: number;
  status: string;
}

export interface PaymentSummary {
  bookingId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  payments: PaymentResponse[];
}

// Definición del contexto
interface ApiContextType {
  // Métodos para viajes
  getAllTravels: () => Promise<Travel[]>;
  getTravelById: (id: number) => Promise<Travel>;

  // Métodos para reservas
  createBooking: (booking: BookingRequest) => Promise<BookingResponse>;
  getAllBookings: () => Promise<BookingResponse[]>;
  getBookingById: (id: number) => Promise<BookingResponse>;
  getUserBookings: (userId: number) => Promise<BookingResponse[]>;
  updateBookingStatus: (id: number, status: string) => Promise<BookingResponse>;

  // Métodos para pagos
  processPayment: (payment: PaymentRequest) => Promise<PaymentResponse>;
  getPaymentSummary: (bookingId: number) => Promise<PaymentSummary>;
  getBookingPayments: (bookingId: number) => Promise<PaymentResponse[]>;
  getUserPayments: (userId: number) => Promise<PaymentResponse[]>;

  // Estado de carga
  isLoading: boolean;
  loadingStates: Record<string, boolean>;
  error: string | null;
}
const ApiContext = createContext<ApiContextType | null>(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  // Función genérica para manejar las peticiones
  const apiRequest = useCallback(
    async <T,>(
      method: string,
      url: string,
      data?: unknown,
      requestId?: string
    ): Promise<T> => {
      // Si se proporciona un ID de solicitud, actualizamos el estado de carga específico
      if (requestId) {
        setLoadingStates((prev) => ({ ...prev, [requestId]: true }));
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await axios({
          method,
          url,
          data,
        });
        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage =
            err.response?.data?.message || "An error occurred";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        setError("An unexpected error occurred");
        throw new Error("An unexpected error occurred");
      } finally {
        if (requestId) {
          setLoadingStates((prev) => ({ ...prev, [requestId]: false }));
        } else {
          setIsLoading(false);
        }
      }
    },
    []
  );

  // Métodos para viajes
  const getAllTravels = useCallback(
    () =>
      apiRequest<Travel[]>("GET", "/api/travels", undefined, "getAllTravels"),
    [apiRequest]
  );

  const getTravelById = useCallback(
    (id: number) =>
      apiRequest<Travel>(
        "GET",
        `/api/travels/${id}`,
        undefined,
        `getTravelById_${id}`
      ),
    [apiRequest]
  );

  // Métodos para reservas
  const createBooking = useCallback(
    (booking: BookingRequest) =>
      apiRequest<BookingResponse>(
        "POST",
        "/api/bookings/create",
        booking,
        "createBooking"
      ),
    [apiRequest]
  );

  const getAllBookings = useCallback(
    () =>
      apiRequest<BookingResponse[]>(
        "GET",
        "/api/bookings",
        undefined,
        "getAllBookings"
      ),
    [apiRequest]
  );

  const getBookingById = useCallback(
    (id: number) =>
      apiRequest<BookingResponse>(
        "GET",
        `/api/bookings/${id}`,
        undefined,
        `getBookingById_${id}`
      ),
    [apiRequest]
  );

  const getUserBookings = useCallback(
    (userId: number) =>
      apiRequest<BookingResponse[]>(
        "GET",
        `/api/bookings/user/${userId}`,
        undefined,
        `getUserBookings_${userId}`
      ),
    [apiRequest]
  );

  const updateBookingStatus = useCallback(
    (id: number, status: string) =>
      apiRequest<BookingResponse>(
        "PATCH",
        `/api/bookings/${id}/status`,
        { status },
        `updateBookingStatus_${id}`
      ),
    [apiRequest]
  );

  // Métodos para pagos
  const processPayment = useCallback(
    (payment: PaymentRequest) =>
      apiRequest<PaymentResponse>(
        "POST",
        "/api/payments",
        payment,
        "processPayment"
      ),
    [apiRequest]
  );

  const getPaymentSummary = useCallback(
    (bookingId: number) =>
      apiRequest<PaymentSummary>(
        "GET",
        `/api/payments/booking/${bookingId}/summary`,
        undefined,
        `getPaymentSummary_${bookingId}`
      ),
    [apiRequest]
  );

  const getBookingPayments = useCallback(
    (bookingId: number) =>
      apiRequest<PaymentResponse[]>(
        "GET",
        `/api/payments/booking/${bookingId}`,
        undefined,
        `getBookingPayments_${bookingId}`
      ),
    [apiRequest]
  );

  const getUserPayments = useCallback(
    (userId: number) =>
      apiRequest<PaymentResponse[]>(
        "GET",
        `/api/payments/user/${userId}`,
        undefined,
        `getUserPayments_${userId}`
      ),
    [apiRequest]
  );

  return (
    <ApiContext.Provider
      value={{
        getAllTravels,
        getTravelById,
        createBooking,
        getAllBookings,
        getBookingById,
        getUserBookings,
        updateBookingStatus,
        processPayment,
        getPaymentSummary,
        getBookingPayments,
        getUserPayments,
        isLoading,
        loadingStates,
        error,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
