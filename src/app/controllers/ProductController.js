import * as Yup from 'yup';
import Product from '../models/Product';
import File from '../models/File';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number(),
      image: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id, title, price, image } = await Product.create(req.body);
    
    const file = await File.findAll({
      where: {
        id: image
      },
      attributes: [ 'name', 'path', 'url' ]
    });
    
    return res.json({
      id,
      title,
      price,
      file
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number(),
      image: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' })
    }

    const {title, price, image } = await product.update(req.body);

    const file = await File.findByPk(image);

    return res.json({
      id: req.query.id,
      title,
      price,
      file
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    await product.destroy();

    return res.json({ message: 'Delete successfull' })

  }

  async list(req, res) {
    const products = await Product.findAll({
      order: [ 'id' ],
      attributes: [
        'title',
        'price',
      ],
      include: [
        {
          model: File,
          as: 'file',
          attributes: ['name', 'path', 'url']
        },
      ]
    })

    return res.json(products);
  }

}

export default new ProductController();