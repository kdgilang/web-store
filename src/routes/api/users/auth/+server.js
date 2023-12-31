import { json } from '@sveltejs/kit';
import { createUserService } from "$lib/services/userServices";
import { sendWaOtpService } from '$lib/services/waServices';

export const POST = async ({request}) => {
  try {
    const { waNumber } = await request.json();

    const res = await sendWaOtpService(waNumber);

    console.log(res);

    if (!res?.status) {
      throw Error(res.message);
    }

    const userRes = await createUserService({
      name: '-',
      waNumber: res.waNumber,
      verification: {
        status: false,
        code: res.code
      }
    });

    if (userRes?.errors) {
      throw Error(userRes.message);
    }

    return json({ status: true, message: 'success!', waNumber });
  } catch (error) {
    return json({ status: false, message: error.message });
  }
}