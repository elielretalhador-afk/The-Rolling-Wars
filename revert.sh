#!/bin/bash
git checkout urb_phase2.3_backup.tar.gz 2>/dev/null || true
git fetch
git reset --hard HEAD
