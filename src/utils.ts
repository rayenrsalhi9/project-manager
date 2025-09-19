import DOMPurify from 'dompurify'

type ValidationFields = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

type ValidationOptions = {
    requireEmail?: boolean;
    requirePassword?: boolean;
    requirePasswordConfirmation?: boolean;
    requireName?: boolean;
    customEmailRegex?: RegExp;
    customPasswordRegex?: RegExp;
    minPasswordLength?: number;
}

export function validateFields(
    fields: ValidationFields,
    options: ValidationOptions = {}
): string | null {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

    const {
        requireEmail = true,
        requirePassword = true,
        requirePasswordConfirmation = true,
        requireName = true,
        customEmailRegex = emailRegex,
        customPasswordRegex = passwordRegex,
        minPasswordLength = 8
    } = options

    const sanitizedFields: ValidationFields = {
        fullName: fields.fullName ? sanitizeField(fields.fullName) : fields.fullName,
        email: fields.email ? sanitizeField(fields.email) : fields.email,
        password: fields.password,
        confirmPassword: fields.confirmPassword
    }

    const { email, password, confirmPassword, fullName } = sanitizedFields;

    // checking required fields
    if (requireEmail && !email?.trim()) {
        return 'Email is required';
    }

    if (requirePassword && !password?.trim()) {
        return 'Password is required';
    }

    if (requirePasswordConfirmation && !confirmPassword?.trim()) {
        return 'Password confirmation is required';
    }

    if (requireName && !fullName?.trim()) {
        return 'Name is required';
    }

    // validate email format
    if (email && !customEmailRegex.test(email.trim())) {
        return 'Please enter a valid email address';
    }

    // validate password strength
    if (password) {
        if (password.length < minPasswordLength) {
            return `Password must be at least ${minPasswordLength} characters long`;
        }

        if (!customPasswordRegex.test(password)) {
            return 'Password must contain at least one lowercase letter, one uppercase letter,  one number, and be at least 8 characters long';
        }
    }

    // check password and password confirmation match
    if (requirePasswordConfirmation && password && confirmPassword) {
        if (password !== confirmPassword) {
        return 'Passwords do not match';
        }
    }

    // if all tests passed, return null
    return null

}

function sanitizeField(field: string): string {
    if (!field) return ''
    return DOMPurify.sanitize(field.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        ALLOW_DATA_ATTR: false, 
        USE_PROFILES: {html: false}, 
        FORBID_TAGS: ['style', 'script'], 
        FORBID_ATTR: ['style', 'on*'], 
        KEEP_CONTENT: true
    })
}