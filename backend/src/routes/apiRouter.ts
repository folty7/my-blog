import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import UserRoutes from './UserRoutes';
import authRouter from './auth.routes';
import postRouter from './post.routes';
import commentRouter from './comment.routes';
import tagRouter from './tag.routes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add UserRouter --------------------------------- //

const userRouter = Router();

userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

apiRouter.use(Paths.Users._, userRouter);

// ----------------------- Add AuthRouter --------------------------------- //

apiRouter.use('/auth', authRouter);

// ----------------------- Add PostRouter --------------------------------- //

apiRouter.use('/posts', postRouter);

// ----------------------- Add CommentRouter ------------------------------ //

apiRouter.use('/comments', commentRouter);

// ----------------------- Add TagRouter ---------------------------------- //

apiRouter.use('/tags', tagRouter);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
