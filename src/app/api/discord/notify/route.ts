/* eslint-disable */
/**
 * API Route: /api/discord/notify
 *
 * Sends notifications to Discord via webhook.
 *
 * TODO: Implement actual Discord webhook posting.
 * For now, this is a stub.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, color, fields } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // TODO: Implement Discord webhook
    // const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    // const embed = {
    //   title,
    //   description,
    //   color: color || 0x00ff00,
    //   fields,
    //   timestamp: new Date().toISOString(),
    // };
    //
    // await fetch(webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ embeds: [embed] }),
    // });

    console.log('TODO: Send Discord notification:', title);

    return NextResponse.json({
      success: true,
      message: 'Discord webhook not implemented yet',
    });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send Discord notification',
      },
      { status: 500 }
    );
  }
}
