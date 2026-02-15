import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Create a new support ticket
 */
router.post('/support/tickets/create', async (req, res) => {
  try {
    const { userId, subject, category, priority, message } = req.body;

    if (!userId || !subject || !category || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate ticket number
    const ticketCount = await prisma.supportTicket.count();
    const ticketNumber = `AIRA-${new Date().getFullYear()}-${String(ticketCount + 1).padStart(4, '0')}`;

    // Create ticket with initial message
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        subject,
        category,
        priority: priority || 'medium',
        status: 'open',
        messages: [
          {
            id: Date.now().toString(),
            senderId: userId,
            senderType: 'user',
            message,
            isInternal: false,
            createdAt: new Date().toISOString()
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

/**
 * Get user's tickets
 */
router.post('/support/tickets', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

/**
 * Get single ticket details
 */
router.post('/support/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user owns the ticket
    if (ticket.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

/**
 * Reply to ticket
 */
router.post('/support/tickets/:ticketId/reply', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user owns the ticket
    if (ticket.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add message to ticket
    const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      senderType: 'user',
      message,
      isInternal: false,
      createdAt: new Date().toISOString()
    };

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        messages: [...messages, newMessage],
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error('Error replying to ticket:', error);
    res.status(500).json({ error: 'Failed to reply to ticket' });
  }
});

export const supportRouter = router;
