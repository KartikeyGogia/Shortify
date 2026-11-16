const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    const shortCode = nanoid(7);

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "URL Created Successfully",
      shortCode: url.shortCode,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getMyUrls = async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(urls);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    await prisma.url.update({
      where: {
        id: url.id,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createShortUrl,
  getMyUrls,
  redirectUrl,
};