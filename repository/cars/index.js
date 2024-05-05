const { Cars: cars } = require("../../models");
const { uploader } = require("../../helper/cloudinary");
const { getCache, setCache, deleteCache } = require("../../helper/redis");

exports.createCar = async (payload) => {
    if (payload.image) {
        const { image } = payload;
        const imageUpload = await uploader(image);
        payload.image = imageUpload.secure_url;
    }

    // save to db
    const data = await cars.create(payload);

    // save to redis
    const key = `car:${data.id}`;
    await setCache(key, data, 300);

    return data;
};

exports.getCars = async () => {
    const data = await cars.findAll();

    return data;
};

exports.getCarByID = async (id) => {
    const key = `car:${id}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data not in cache, then get data from db
        data = await cars.findAll({
            where: {
                id,
            },
        });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`Car is not found!`);
        }
    }
};

exports.updateCar = async (id, payload) => {
    const key = `car:${id}`;

    if (payload.image) {
        const { image } = payload;
        image.publicId = crypto.randomBytes(16).toString("hex");
        image.name = `${image.publicId}${path.parse(image.name).ext}`;

        const imageUpload = await uploader(image);
        payload.image = imageUpload.secure_url;
    }

    // update data in db
    await cars.update(payload, {
        where: {
            id,
        },
    });

    // get data from db in order to update the cache
    const data = await cars.findAll({
        where: {
            id,
        },
    });

    if (data.length > 0) {
        await deleteCache(key);
        await setCache(key, data[0], 300);
        return data[0];
    } else {
        throw new Error(`Car is not found!`);
    }
};

exports.deleteCar = async (id, deletedBy) => {
    const key = `car:${id}`;

    await cars.update({ deletedBy }, { where: { id } });
    await cars.destroy({ where: { id } });
    await deleteCache(key);

    return null;
};
