import {
  Client,
  Candidate,
  PaginatedResponse,
  CreateClientInput,
} from "./types";

const API_BASE = "/api";

// Client API functions
export const clientApi = {
  // Get all clients with pagination
  async getClients(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Client>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(`${API_BASE}/clients?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }

    return response.json();
  },

  // Get a specific client
  async getClient(id: string): Promise<Client> {
    const response = await fetch(`${API_BASE}/clients/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }

    const result = await response.json();
    return result.data;
  },

  // Create a new client
  async createClient(data: CreateClientInput): Promise<Client> {
    const response = await fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create client");
    }

    const result = await response.json();
    return result.data;
  },

  // Update a client
  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update client");
    }

    const result = await response.json();
    return result.data;
  },

  // Delete a client
  async deleteClient(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete client");
    }
  },

  // Send survey email to client
  async sendSurveyEmail(
    id: string,
    data: {
      surveyEmailSentBy: string;
      surveyEmailSentAt: Date;
    }
  ): Promise<Client> {
    const response = await fetch(`${API_BASE}/clients/${id}/send-survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send survey email");
    }

    const result = await response.json();
    return result.data;
  },
};

// Candidate API functions
export const candidateApi = {
  // Get all candidates with pagination
  async getCandidates(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Candidate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(`${API_BASE}/candidates?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch candidates");
    }

    return response.json();
  },

  // Get a specific candidate
  async getCandidate(id: string): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch candidate");
    }

    const result = await response.json();
    return result.data;
  },

  // Create a new candidate
  async createCandidate(
    data: Omit<
      Candidate,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "surveyEmailSent"
      | "surveyEmailSentAt"
      | "surveyEmailSentBy"
    >
  ): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log("create candidate error", error);
      throw new Error(error.error);
    }

    const result = await response.json();
    return result.data;
  },

  // Update a candidate
  async updateCandidate(
    id: string,
    data: Partial<Candidate>
  ): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update candidate");
    }

    const result = await response.json();
    return result.data;
  },

  // Delete a candidate
  async deleteCandidate(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete candidate");
    }
  },

  // Send survey email to candidate
  async sendSurveyEmail(
    id: string,
    data: {
      surveyEmailSentBy: string;
      surveyEmailSentAt: Date;
    }
  ): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates/${id}/send-survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send survey email");
    }

    const result = await response.json();
    return result.data;
  },

  // Submit candidate survey answers
  async submitSurveyAnswers(
    id: string,
    data: {
      answers: Array<{
        questionId: string;
        answer: string;
      }>;
    }
  ): Promise<{
    surveyAnswers: Array<{
      id: string;
      candidateId: string;
      questionId: string;
      answer: string;
      answeredAt: string;
    }>;
    updatedCandidate: {
      id: string;
      surveyCompleted: boolean;
      surveyCompletedAt: string;
    };
  }> {
    const response = await fetch(`${API_BASE}/candidates/${id}/submit-survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit survey answers");
    }

    const result = await response.json();
    return result.data;
  },
};
