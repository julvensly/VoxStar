const API_URL = 'https://voxstar.onrender.com/api'

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erreur lors de l’inscription')
  }

  return result
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erreur lors de la connexion')
  }

  return result
}

export async function getMe() {
  const token = localStorage.getItem('voxstar_token')

  if (!token) {
    throw new Error('Utilisateur non connecté')
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Session invalide')
  }

  return result
}

export async function updateProfileName(data) {
  const token = localStorage.getItem('voxstar_token')

  if (!token) {
    throw new Error('Utilisateur non connecté')
  }

  const response = await fetch(`${API_URL}/profile/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Erreur lors de la modification du nom'
    )
  }

  return result
}

export async function updateProfilePhoto(file) {
  const token = localStorage.getItem('voxstar_token')

  if (!token) {
    throw new Error('Utilisateur non connecté')
  }

  const formData = new FormData()

  formData.append('photo', file)

  const response = await fetch(
    `${API_URL}/profile/photo`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Erreur lors de la modification de la photo'
    )
  }

  return result
}
