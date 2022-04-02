const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const Teacher = require("../models/teachers");

class TeacherController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const teacher = await Teacher.create({ name });
      return res.json(teacher)
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { authorId, musicId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let author;
      if (!authorId && !musicId) {
        author = await Author.findAndCountAll({ limit, offset });
      }
      if (authorId && !musicId) {
        author = await Author.findAndCountAll({
          where: { id: authorId },
          limit,
          offset,
        });
      }
      if (!authorId && musicId) {
        author = await Author.findAndCountAll({
          where: { id: musicId },
          limit,
          offset,
        });
      }
      if (authorId && musicId) {
        author = await Author.findAndCountAll({
          where: { id: musicId, id: authorId },
          limit,
          offset,
        });
      }
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    try { 
      const { id } = req.params;
      const author = await Author.findAll({
        where: { id },
      });
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAuthorLike(req, res, next) {
    try {
      const { names, date } = req.query;
      console.log('\n\n\n\n', names, date);
      let author;
      if (date && !names) {
        author = await Author.findAll({
          where: {
            createdAt: {
              [Op.gte]: moment.utc(date),
              [Op.lt]: moment.utc(date).add(1, "day"),
            },
          },
        });
        next(author.filter((author) => author !== null));
      }
      if ((names && date) || names) {
        const operator = date ? Op.and : Op.or;
        author = await Promise.all(
          names
            .split(",")
            .filter((name) => name.trim().length)
            .map(
              async (name) =>
                await Author.findAll({
                  where: {
                    [operator]: [
                      {
                        name: {
                          [Op.substring]: name.trim(),
                        },
                      },
                      {
                        createdAt: {
                          [Op.gte]: moment.utc(date || '2000-01-01'),
                          [Op.lt]: moment.utc(date || '2000-01-01').add(1, "day"),
                        },
                      },
                    ],
                  },
                })
            )
        );
        return next(author.filter((author) => author !== null)[0]);
      }
      return res.json({ message: "Параметры names или date не указаны!" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOneMusic(req, res, next) {
    try {
      const { id } = req.params;
      const author = await Author.findAll({
        where: { id },
        include: [{ model: Music }],
      });
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAllMusic(req, res, next) {
    try {
      const { authors } = req.query;
      if (!authors instanceof Array) {
        next(ApiError.badRequest("Параметр не в виде массива"));
      }
      const author = await Author.findAll({
        where: {
          id: {
            [Op.in]: authors.split(","),
          },
        },
        include: [{ model: Music }],
      });
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id, name } = req.body;
      const author = await Author.update(
        {
          name,
        },
        {
          where: { id },
        }
      );
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const author = await Author.destroy({
        where: { id },
      });
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async deleteAll(req, res, next) {
    try {
      const author = await Author.destroy({
        truncate: true,
      });
      next(author);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new TeacherController();
