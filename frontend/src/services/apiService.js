import axios from 'axios';

const API_URL = 'http://localhost:5013/api';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};



export const registerCategory = async (newCategory) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, newCategory, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const registerService = async (newService) => {
  try {
    const response = await axios.post(`${API_URL}/services`, newService, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};


export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};
export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const getProfissionalById = async (id) => {
  try {
    console.log(id);
    const response = await axios.get(`${API_URL}/profissionals/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};


export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/appointments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
}

export const deleteProfissional = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/profissionals/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
}

export const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userData.id}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const sendEmail = (user) => {
  const emailBody = `
      <h2>Nova Conta Criada</h2>
      <p>Um novo usuário criou uma conta com as seguintes informações:</p>
      <table style="border: 1px solid #dddddd; border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
          <td style="border: 1px solid #dddddd; padding: 8px;">${user.nomeCompleto}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
          <td style="border: 1px solid #dddddd; padding: 8px;">${user.enderecoEmail}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
          <td style="border: 1px solid #dddddd; padding: 8px;">${user.username}</td>
        </tr>
         <tr>
          <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
          <td style="border: 1px solid #dddddd; padding: 8px;">${user.telemovel}</td>
        </tr>
      </table>
    `;
  window.Email.send({
    Host: "smtp.elasticemail.com",
    Username: "bpter01@gmail.com",
    Password: "ADF2481E9986097E2234616C72EE3B8EFE9A",
    To: 'bpter01@gmail.com',
    From: 'bpter01@gmail.com',
    Subject: 'Nova conta por ativar',
    Body: emailBody
  });

}



export const registerAppointment = async (dados) => {
  try {
    const response = await axios.post(`${API_URL}/appointments`, dados, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const updateAppointment = async (dados) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${dados.id}`, dados, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};



export const registerProfissinal = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/profissionals`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const registerProfissinalHorario = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/profissionalHorarios`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};

export const getProfissinalHorarioById = async (idProfissional) => {
  try {
    const response = await axios.get(`${API_URL}/profissionalHorarios/profissional/${idProfissional}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data);
  }
};



export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data || 'Failed to fetch services');
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data || 'Failed to fetch services');
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data || 'Failed to fetch categories');
  }
};


export const getAllProfessionals = async () => {
  try {
    const response = await axios.get(`${API_URL}/profissionals`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data || 'Failed to fetch services');
  }
};



//TODO: CRIAR AUTENTICACAO
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const user = response.data;
    if (user) {
      return user;
    } else {
      throw new Error('Usuário não encontrado ou credenciais inválidas');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Falha ao fazer login');
  }
};


