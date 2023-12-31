import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { updateUserRepository, getUserByQueryRepository } from '$lib/data/repositories/userRepositories';

export async function load({ cookies }) {
  try {
    const token = cookies.get('userToken');
    const { user } = jwt.verify(token, JWT_SECRET_KEY);
    const userRes = await getUserByQueryRepository({ _id: user._id});
    
    return {
      user: JSON.stringify(userRes)
    }
  } catch (error) {
    return { errorMessage: error.message }
  }
}

export const actions = {
  update: async ({ request, cookies }) => {
    try {
      const token = cookies.get('userToken');
      const { user } = jwt.verify(token, JWT_SECRET_KEY);
      const data = await request.formData();

      await updateUserRepository({ _id: user._id }, {
        name: data.get('name'),
        address: data.get('address')
      })

      return {
        status: true,
        message: 'successfully updated.'
      }
    } catch(error) {
      return {
        status: false,
        message: error.message
      }
    }
  } 
}