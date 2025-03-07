import express from 'express';
import { BoardService } from '../services';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // const userId = req.kauth.grant?.access_token?.content.sub;
    // console.log('boards.create', userId, req.body)
    // const board = await new BoardService().createBoard(userId, req.body);
    const board = await new BoardService().createBoard(req.body);
    console.log('boards.create result', board)
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ error: (error  as any).message });
  }
});

router.get('/:id',  async (req, res) => {
  try {
    const board = await new BoardService().getBoard(req.params.id);
    res.json(board);
  } catch (error) {
    res.status(404).json({ error: (error  as any).message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;
    const boardService = new BoardService();

    let board;
    if (req.body.name) {
      board = await boardService.renameBoard(
              req.params.id,
              req.body.name
      );
    } else if (req.body.data) {
      board = await boardService.updateInitialDataBoard(
              req.params.id,
              req.body.data
      );
    } else {
      res.status(400).json({error: "Invalid request: missing 'name' or 'data'"});
    }
    res.json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json({error: error.message});
    } else {
      res.status(500).json({error: "Unknown error occurred"});
    }
  }
});

router.delete('/:id',  async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;
    console.log('boards.delete', req.params.id, userId)
    const result =  await new BoardService().deleteBoard(req.params.id, userId);
    console.log('boards.delete result', result)

    res.status(204).end();
  } catch (error) {
      if (error instanceof Error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

router.get('/',  async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log('boards.get', {userId, page, limit})
    // const result = await new BoardService().listBoards(userId, page, limit);
    const result = await new BoardService().listBoards( page, limit);
    console.log('boards.get result', JSON.stringify(result, null, 2))
    res.json(result);
  } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

router.post('/:id/share',  async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;;
    const result = await new BoardService().shareBoard(
      req.params.id,
      userId,
      req.body.userId,
      req.body.role
    );
    res.status(201).json(result);
  } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

export default router;