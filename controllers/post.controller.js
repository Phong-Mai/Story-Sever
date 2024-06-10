import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import snappy from 'snappy';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D').replace(/\s/g, "-").toLowerCase()

    // .split(' ')
    // .join('-')
    // .toLowerCase()
    // .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 17;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: {$regex: req.query.category , $options: 'i'} }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.author && { author: {$regex: req.query.author , $options: 'i'} }),
      ...(req.query.searchTerm && {
        $or: [
          { slug: { $regex: req.query.searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D').replace(/\s/g, "-"), $options: 'i' } },
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    }
    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};


export const getcategory = async (req, res, next) => {
  try {
    const posts =await Post.find({
      ...(req.query.category && { category: {$regex: req.query.category, $options : 'i'} }),
    })
    res.status(200).json({posts})
  } catch (error) {
    next(error)
  }
}
export const getstorychapter = async (req, res, next) => {
  try {
    // const startIndex = parseInt(req.query.startIndex) || 0;
    // const limit = parseInt(req.query.limit) || 17;
    // const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const filter = {
      ...(req.query.slug && { slug: req.query.slug }),
    }
    const posts = await Post.find(filter)
     const decompressedContent = posts[0]?.content?.map((post) => {
        const decompressed = [];
        const content = post?.content
        if(!content){
          return
        }
        try {
          const base64Data = content.toString('base64')
        const compressedBuffer = Buffer.from(base64Data, 'base64');
        const decompressedBuffer = snappy.uncompressSync(compressedBuffer);
        const decompressedText = decompressedBuffer.toString('utf8');
            decompressed.push({ titleChapter: post.titleChapter, content: decompressedText });

        return { ...post, content: decompressedText };
        } catch (error) {
          console.log(error);
        }
      });
      posts[0].content = decompressedContent
      
   
      // .sort({ updatedAt: sortDirection })
      // .skip(startIndex)
      // .limit(limit);
     
      // const text = 'Đây là một đoạn văn bản tiếng việt cần được nén.';
     
      
      // const compressedBuffer = snappy.compressSync(utf8Buffer);
      // const decompressed = snappy.uncompressSync(compressedBuffer).toString('utf8')
    
      // const decompressedContent = posts[0]?.content?.map(async (post) => {
      //   const decompressed = [];
      //   const content = post?.content
      //   try {
      //       const decompressedBuffer = snappy.uncompressSync(content).toString('utf8');
    
      //   } catch (error) {
      //     console.log(error);
      //   }
      //       decompressed.push({ titleChapter: post.titleChapter, content: decompressedContent });

      //   return { ...post, content: decompressed };
      // });
      // console.log(decompressedContent);
    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
}
export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if ( req.body._id !== req.params.postId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          status: req.body.status,
          image: req.body.image,
          __v: req.body.__v
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
export const addpost = async (req, res, next) => {
  // const {titleChapter, content} = req.body.content
  
  try {
    const addpost = await Post.findById(req.params.postId);
    if (!addpost) {
      return next(errorHandler(404, 'Comment not found'));
    }
  
  //   const compressedContent = snappy.compressSync(Buffer.from(content, 'utf8'));
  // addpost.content.push({titleChapter, content : compressedContent});
      
    //  addpost.content.push({titleChapter, content})
   
    await addpost.save();
    res.status(200).json(addpost);
  } catch (error) {
    next(error);
  }
};
