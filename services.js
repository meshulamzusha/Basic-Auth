import bcrypt from 'bcrypt';
import { getSupabaseClient } from './supabase.js';
import { ifError } from 'node:assert';

const supabase = getSupabaseClient()


export async function signupService(username, password) {
    try {
        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await supabase
            .from("users")
            .insert({ username: username, hash_password: hash })

        return result

    } catch (error) {
        throw error
    }
}


export async function verifyService(username, password) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq('username', username)
            .single()

        if (error) {
            throw error
        }

        const match = await bcrypt.compare(password, data.hash_password);

        return match
        
    } catch (error) {
        throw error
    }
}


export function decodeMessageService(message) {
    let sum = message[0];

    for (let i = 0; i < message.length -1; i++) {
        if (message[i] < message[i + 1]) {
            sum += message[i + 1]
        } else {
            return -1
        }
    }

    return sum 
}