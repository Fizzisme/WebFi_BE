import slugify from 'slugify';

export const generateSlug = (title: string) => {
    return slugify(title, {
        lower: true, // chữ thường
        strict: true, // bỏ ký tự đặc biệt
        trim: true,
    });
};
